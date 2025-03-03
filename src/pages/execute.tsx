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
  MidenCustomTransaction,
  Transaction,
  WalletNotConnectedError,
} from '@demox-labs/miden-wallet-adapter-base';
import { useMidenSdk } from '@/lib/hooks/use-miden-sdk';

const ExecutePage: NextPageWithLayout = () => {
  const { wallet, publicKey } = useWallet();
  const { Miden } = useMidenSdk();

  let [amount, setAmount] = useState<number | undefined>(100);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!publicKey) throw new WalletNotConnectedError();

    const faucetId = Miden.AccountId.from_hex(
      '0x6f2c28f3a32575200000457d2cfec3'
    );
    const accountId = Miden.AccountId.from_hex(publicKey);
    const noteType =
      event.target.name === 'private'
        ? Miden.NoteType.private()
        : Miden.NoteType.public();
    // const transactionRequest = await client.create_send_transaction_request(
    //   accountId,
    //   faucetId,
    //   noteType,
    //   BigInt(amount!)
    // );
    // const midenTransaction = Transaction.createCustomTransaction(
    //   publicKey,
    //   transactionRequest
    // );
    // const txRequestBytes = transactionRequest.serialize();
    // const base64 = Buffer.from(txRequestBytes).toString('base64');
    // (midenTransaction.payload as MidenCustomTransaction).transactionRequest =
    //   base64;

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

ExecutePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ExecutePage;
