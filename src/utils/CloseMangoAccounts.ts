import { Wallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { MangoService } from './MangoService';

// TODO: do not accept null here. Should pass in mango account public key.
export async function closeMangoAccount(
  mangoAccountPK: PublicKey | null,
  wallet: Wallet
) {
  const mangoService = new MangoService(wallet);

  if (!mangoAccountPK) {
    mangoAccountPK = (await mangoService.getAllExistingAccounts())[0].publicKey;
  }

  await mangoService.closeMangoAccount(mangoAccountPK);
}
