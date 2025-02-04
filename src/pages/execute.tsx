import { useState, FormEvent, SyntheticEvent, useEffect } from 'react';
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import Base from '@/components/ui/base';
import { useWallet } from '@demox-labs/miden-wallet-adapter-react';
import { TridentWalletAdapter } from '@demox-labs/miden-wallet-adapter-trident';
import { Check } from '@/components/icons/check';
import Button from '@/components/ui/button';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import {
  Transaction,
  WalletNotConnectedError,
} from '@demox-labs/miden-wallet-adapter-base';
import {
  Account,
  AccountId,
  AccountStorageMode,
  NoteType,
  WebClient,
} from '@demox-labs/miden-sdk';

const MintPage: NextPageWithLayout = () => {
  const { wallet, publicKey } = useWallet();
  const webClient = new WebClient();
  const [faucetId] = useLocalStorage('miden_faucet_id', '0x29b86f9443ad907a');

  let [amount, setAmount] = useState<number | undefined>(undefined);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!publicKey) throw new WalletNotConnectedError();

    await webClient.create_client('http://localhost:57291');
    const accountId = AccountId.from_hex(publicKey);
    await webClient.fetch_and_cache_account_auth_by_pub_key(accountId);
    const noteType =
      event.target.name === 'private' ? NoteType.private() : NoteType.public();
    // const transactionRequest = await webClient.create_mint_transaction_request(
    //   accountId,
    //   AccountId.from_hex(faucetId!),
    //   noteType,
    //   BigInt(amount!)
    // );
    // const midenTransaction =
    //   Transaction.createCustomTransaction(transactionRequest);

    // const txId =
    //   (await (wallet?.adapter as TridentWalletAdapter).requestTransaction(
    //     midenTransaction
    //   )) || '';
    // if (event.target?.elements[0]?.value) {
    //   event.target.elements[0].value = '';
    // }
  };

  const handleAmountChange = (event: any) => {
    event.preventDefault();
    setAmount(event.currentTarget.value);
  };

  return (
    <>
      <NextSeo
        title="Trident Wallet Request Mint"
        description="Request Mint from the Trident Wallet"
      />
      <Base>
        <form
          className="relative flex w-full flex-col rounded-full md:w-auto"
          noValidate
          role="search"
          onSubmit={async (event: SyntheticEvent<HTMLFormElement>) => {
            await handleSubmit(event);
          }}
        >
          <label className="flex w-full items-center py-4">
            <input
              className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
              placeholder="Amount: ie, 100"
              autoComplete="off"
              onChange={(event: FormEvent<Element>) =>
                handleAmountChange(event)
              }
              value={amount}
            />
            <span className="pointer-events-none absolute flex h-full w-8 cursor-pointer items-center justify-center text-gray-600 hover:text-gray-900 ltr:left-0 ltr:pl-2 rtl:right-0 rtl:pr-2 dark:text-gray-500 sm:ltr:pl-3 sm:rtl:pr-3">
              <Check className="h-4 w-4" />
            </span>
            <Button
              disabled={!publicKey || !amount}
              name="public"
              type="submit"
              color="white"
              className="ml-4 shadow-card dark:bg-gray-700 md:h-10 md:px-5 xl:h-12 xl:px-7"
            >
              {!publicKey ? 'Connect Your Wallet' : 'Mint Public Note'}
            </Button>
            <Button
              disabled={!publicKey || !amount}
              name="private"
              type="submit"
              color="white"
              className="ml-4 shadow-card dark:bg-gray-700 md:h-10 md:px-5 xl:h-12 xl:px-7"
            >
              {!publicKey ? 'Connect Your Wallet' : 'Mint Private Note'}
            </Button>
          </label>
        </form>
      </Base>
    </>
  );
};

MintPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default MintPage;
