import { Commitment, Connection, PublicKey } from '@solana/web3.js';
import {
  Config,
  getMarketByBaseSymbolAndKind,
  GroupConfig,
  MangoAccount,
  MangoClient,
  MangoGroup,
  MarketKind,
  PerpMarket,
  PerpOrderType,
} from '@blockworks-foundation/mango-client';
import configFile from '@blockworks-foundation/mango-client/lib/src/ids.json';
import { Wallet } from '@solana/wallet-adapter-react';
import { getMintPublicKey } from './Mint';
import BN from 'bn.js';
import { TokenType } from './TokenType';

const demoxReferrerPK = new PublicKey(
  'FiQfpnLtGocyQFedgHHTNFwaHH8nd417NNe1Hj2yhJKx'
);

export interface PositionStats {
  publicKey: PublicKey;
  equity: string;
  healthRatio: string;
  pnl: number;
  liqPriceStr: string;
  tokenType: TokenType;
  price: number;
  type: 'buy' | 'sell';
  quantity: number;
}

export class MangoService {
  config: Config;
  groupConfig: GroupConfig;
  connection: Connection;
  client: MangoClient;
  mangoGroup: MangoGroup | null = null;
  wallet: Wallet;

  constructor(wallet: Wallet) {
    this.wallet = wallet;
    this.config = new Config(configFile);
    this.groupConfig = this.config.getGroupWithName('mainnet.1')!;
    this.connection = new Connection(
      this.config.cluster_urls[this.groupConfig.cluster],
      'processed' as Commitment
    );
    this.client = new MangoClient(
      this.connection,
      this.groupConfig.mangoProgramId
    );
  }

  async initialize() {
    this.mangoGroup = await this.client.getMangoGroup(
      this.groupConfig.publicKey
    );
    await this.mangoGroup.loadRootBanks(this.connection);
  }

  async createMangoAccountAndDeposit(
    depositAmountInToken: number,
    tokenType: TokenType
  ) {
    if (!this.mangoGroup) {
      await this.initialize();
    }

    // special case for SOL -- the mango client deals with all deposits as tokens, and converts SOL
    // to wrapped SOL. In this case, the token account public key should just be the customer's public key.
    // See https://github.com/blockworks-foundation/mango-client-v3/blob/main/src/client.ts#L1140.
    let ataPublicKey: PublicKey;
    if (tokenType === TokenType.SOL) {
      ataPublicKey = this.wallet.adapter.publicKey!;
    } else {
      ataPublicKey = await this.getEncodedATAPublicKey(
        this.wallet.adapter.publicKey!,
        tokenType
      );
    }
    if (!ataPublicKey) return;

    const tokenIndex = this.mangoGroup!.getTokenIndex(
      getMintPublicKey(tokenType)!
    );

    const mangoGroupPublicKey =
      this.mangoGroup?.rootBankAccounts?.[tokenIndex]?.nodeBankAccounts[0]
        .publicKey;
    const vault =
      this.mangoGroup?.rootBankAccounts?.[tokenIndex]?.nodeBankAccounts[0]
        .vault;

    if (!this.mangoGroup || !mangoGroupPublicKey || !vault) return;

    const nextAccountNumber = await this.getNextAccountNumber();

    return await this.client.createMangoAccountAndDeposit(
      this.mangoGroup!,
      this.wallet.adapter,
      this.mangoGroup.tokens[tokenIndex].rootBank,
      mangoGroupPublicKey,
      vault,
      ataPublicKey,
      depositAmountInToken,
      nextAccountNumber,
      undefined,
      demoxReferrerPK
    );
  }

  async getEncodedATAPublicKey(
    publicKey: PublicKey,
    tokenType: TokenType
  ): Promise<PublicKey> {
    const tokenMint = getMintPublicKey(tokenType);
    if (!tokenMint) {
      throw new Error(`Mint public key for ${tokenType} does not exist.`);
    }

    const encodedTokenAccounts = await this.connection.getTokenAccountsByOwner(
      publicKey,
      { mint: tokenMint }
    );

    return encodedTokenAccounts.value[0].pubkey;
  }
  /**
   *
   * @param existingAccounts existing mango accounts owned by @publicKey
   * @param mangoGroup the group in which the accounts exist
   * @param publicKey owner's public key, which owns the @existingAccounts
   * @param programId programId of mango
   * @returns the next number to create an account with. Given a set of n accounts, checks to see if a PDA
   * mango account exists for n, then n-1, ... until 0. n + 1 numbers will be checked, so this guarantees that an
   * available account number will be found. We check in the reverse order because if a customer is not deleting
   * accounts, n will be the next available account number.
   */
  async getNextAccountNumber(): Promise<number> {
    const existingAccounts = await this.getAllExistingAccounts();
    const programId = this.client.programId;
    let accountNumbersToCheck = existingAccounts.length;
    let accountPKSet = new Set<string>();
    existingAccounts.forEach((acc) => {
      accountPKSet.add(acc.publicKey.toString());
    });

    for (var i = accountNumbersToCheck; i > -1; i--) {
      let nextAccountNumberBN = new BN(i);
      let [programPk, _] = await PublicKey.findProgramAddress(
        [
          this.mangoGroup!.publicKey.toBuffer(),
          this.wallet.adapter.publicKey!.toBytes(),
          nextAccountNumberBN.toArrayLike(Buffer, 'le', 8),
        ],
        programId
      );

      if (!accountPKSet.has(programPk.toString())) {
        return i;
      }
    }

    return -1;
  }

  async getAllExistingAccounts(): Promise<MangoAccount[]> {
    if (!this.mangoGroup) {
      await this.initialize();
    }

    return await this.client.getMangoAccountsForOwner(
      this.mangoGroup!,
      this.wallet.adapter.publicKey!,
      false
    );
  }

  async getMangoAccount(mangoAccountPK: PublicKey) {
    if (!this.mangoGroup) {
      await this.initialize();
    }

    const mangoAccount = await this.client.getMangoAccount(
      mangoAccountPK,
      this.mangoGroup!.dexProgramId
    );

    return mangoAccount;
  }

  async closeMangoAccount(mangoAccountPK: PublicKey) {
    if (!this.mangoGroup) {
      await this.initialize();
    }

    // hardcoded here to convert interest and accrued mango to usdc
    const USDC_TOKEN_INDEX = this.mangoGroup!.getTokenIndex(
      getMintPublicKey(TokenType.USDC)!
    );

    const mangoGroup = this.mangoGroup!;
    const mangoAccount = await this.getMangoAccount(mangoAccountPK);
    const cache = await this.mangoGroup!.loadCache(this.connection);
    const perpIndex = mangoAccount.perpAccounts.findIndex(
      (acc) => acc.basePosition.toNumber() != 0
    );

    if (perpIndex >= 0) {
      mangoGroup.perpMarkets[perpIndex];
      const perpMarketConfig = this.groupConfig.perpMarkets[perpIndex];
      const perpMarket = await mangoGroup.loadPerpMarket(
        this.connection,
        perpMarketConfig.marketIndex,
        perpMarketConfig.baseDecimals,
        perpMarketConfig.quoteDecimals
      );

      await this.client.settleAllPerpPnl(
        mangoGroup,
        cache,
        mangoAccount,
        [perpMarket],
        mangoGroup.rootBankAccounts[USDC_TOKEN_INDEX]!,
        this.wallet.adapter
      );
    }

    return await this.client.emptyAndCloseMangoAccount(
      this.mangoGroup!,
      mangoAccount,
      cache,
      USDC_TOKEN_INDEX,
      this.wallet.adapter
    );
  }

  async getMangoAccountInfo(mangoAccountPK: PublicKey) {
    const mangoAccount = await this.getMangoAccount(mangoAccountPK);
    const cache = await this.mangoGroup!.loadCache(this.connection);

    return mangoAccount.toPrettyString(
      this.groupConfig,
      this.mangoGroup!,
      cache
    );
  }

  async getAllMangoAccountsStats() {
    const accounts = await this.getAllExistingAccounts();
    let accountStats = accounts.map((acc) =>
      this.getMangoAccountStats(acc.publicKey)
    );
    let positions = await Promise.all(accountStats);
    return positions.filter((pos): pos is PositionStats => !!pos);
  }

  async getMangoAccountStats(
    mangoAccountPK: PublicKey
  ): Promise<PositionStats | undefined> {
    if (!this.mangoGroup) {
      await this.initialize();
    }
    const mangoAccount = await this.getMangoAccount(mangoAccountPK);
    const cache = await this.mangoGroup!.loadCache(this.connection);
    const healthRatio = mangoAccount
      .getHealthRatio(this.mangoGroup!, cache, 'Maint')
      .toFixed(2);
    const pnl =
      parseFloat(
        mangoAccount
          .calcTotalPerpUnsettledPnl(this.mangoGroup!, cache)
          .toFixed(4)
      ) /
      10 ** 6;
    const equity = mangoAccount
      .computeValue(this.mangoGroup!, cache)
      .toFixed(4);

    const perpIndex = mangoAccount.perpAccounts.findIndex(
      (acc) => acc.basePosition.toNumber() != 0
    );
    if (!perpIndex || perpIndex < 0) {
      return;
    }

    const perpAccount = mangoAccount.perpAccounts[perpIndex];
    const type: 'buy' | 'sell' =
      perpAccount.basePosition.toNumber() > 0 ? 'buy' : 'sell';

    const liqPrice = mangoAccount.getLiquidationPrice(
      this.mangoGroup!,
      cache,
      perpIndex
    );
    const liqPriceStr = liqPrice !== undefined ? liqPrice.toFixed(3) : 'N/A';
    const perpMarketConfig = this.groupConfig.perpMarkets[perpIndex];
    const price = this.mangoGroup!.getPrice(perpIndex, cache).toNumber();

    const perpMarket = await this.mangoGroup!.loadPerpMarket(
      this.connection,
      perpMarketConfig.marketIndex,
      perpMarketConfig.baseDecimals,
      perpMarketConfig.quoteDecimals
    );
    const quantity = Math.abs(
      perpMarket.baseLotsToNumber(perpAccount.basePosition)
    );

    const retVal = {
      publicKey: mangoAccountPK,
      equity,
      healthRatio,
      pnl,
      liqPriceStr,
      tokenType: perpMarketConfig.baseSymbol as TokenType,
      price,
      type,
      quantity,
    };

    return retVal;
  }

  async createPerp(
    mangoAccountPK: PublicKey,
    side: 'buy' | 'sell',
    perpToken: TokenType,
    perpAmount: number,
    perpPrice: number
  ) {
    if (!this.mangoGroup) {
      await this.initialize();
    }

    const smallestTokenAmount = await this.getSmallestTokenAmount(perpToken);
    if (perpAmount < smallestTokenAmount) {
      throw new Error(
        `Token quantity too small. Smallest token unit: ${smallestTokenAmount}`
      );
    }

    const perpMarketConfig = getMarketByBaseSymbolAndKind(
      this.groupConfig,
      perpToken,
      'perp'
    );
    const mangoAccount = await this.getMangoAccount(mangoAccountPK);
    const perpMarket = await this.mangoGroup!.loadPerpMarket(
      this.connection,
      perpMarketConfig.marketIndex,
      perpMarketConfig.baseDecimals,
      perpMarketConfig.quoteDecimals
    );
    const options = {
      orderType: 'market' as PerpOrderType,
    };

    await this.client.placePerpOrder2(
      this.mangoGroup!,
      mangoAccount,
      perpMarket,
      this.wallet.adapter,
      side,
      perpPrice,
      perpAmount,
      options
    );
  }

  async getSmallestTokenAmount(perpToken: TokenType): Promise<number> {
    if (!this.mangoGroup) {
      await this.initialize();
    }

    const perpMarketConfig = getMarketByBaseSymbolAndKind(
      this.groupConfig,
      perpToken,
      'perp'
    );
    const perpMarket = await this.mangoGroup!.loadPerpMarket(
      this.connection,
      perpMarketConfig.marketIndex,
      perpMarketConfig.baseDecimals,
      perpMarketConfig.quoteDecimals
    );

    const baseUnits = Math.pow(10, perpMarket.baseDecimals);
    const baseMangoUnits = perpMarket.baseLotSize.toNumber();

    return baseMangoUnits / baseUnits;
  }
}
