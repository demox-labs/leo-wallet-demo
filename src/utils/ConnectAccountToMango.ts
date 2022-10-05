import { PublicKey } from '@solana/web3.js';
import { Wallet } from '@solana/wallet-adapter-react';
import { TokenType } from './TokenType';
import { MangoService } from './MangoService';

export async function connectAccountToMango(
  wallet: Wallet,
  depositToken: TokenType,
  depositAmount: number
) {
  const mangoService = new MangoService(wallet);

  const result = await mangoService.createMangoAccountAndDeposit(
    depositAmount,
    depositToken
  );

  let accountPk = new PublicKey(PublicKey.default);
  if (result) {
    accountPk = new PublicKey(result[0]);
  }

  // print account balances
  console.log(await mangoService.getMangoAccountInfo(accountPk));

  return accountPk;
}
