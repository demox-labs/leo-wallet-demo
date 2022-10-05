import { Wallet } from '@solana/wallet-adapter-react';
import { connectAccountToMango } from './ConnectAccountToMango';
import { MangoService } from './MangoService';
import { PerpType } from './PerpType';
import { TokenType } from './TokenType';

export async function createPerp(
  wallet: Wallet,
  depositToken: TokenType,
  depositAmount: number,
  perpToken: TokenType,
  perpAmount: number,
  perpPrice: number, // easiest to set this to the market price for now
  perpType: PerpType
) {
  const mangoService = new MangoService(wallet);

  const smallestAmount = await mangoService.getSmallestTokenAmount(perpToken);
  if (perpAmount < smallestAmount) {
    throw new Error(
      `Token quantity too small. Smallest token unit: ${smallestAmount}`
    );
  }

  const mangoAccountPK = await connectAccountToMango(
    wallet,
    depositToken,
    depositAmount
  );
  // Shorting means selling the short asset at the current market price.
  // Going long is buying the long asset at the current market price.
  const side = perpType === PerpType.Short ? 'sell' : 'buy';

  // welcome to perpNation https://www.youtube.com/watch?v=XOJAddj_SJE
  await mangoService.createPerp(
    mangoAccountPK,
    side,
    perpToken,
    perpAmount,
    perpPrice
  );
}
