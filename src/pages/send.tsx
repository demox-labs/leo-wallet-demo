import { useState, FormEvent, SyntheticEvent, useEffect } from 'react';
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import Base from '@/components/ui/base';
import { useWallet } from '@demox-labs/miden-wallet-adapter-react';
import { TridentWalletAdapter } from '@demox-labs/miden-wallet-adapter-trident';
import { Check } from '@/components/icons/check';
import Button from '@/components/ui/button';
import {
  SendTransaction,
  WalletNotConnectedError,
} from '@demox-labs/miden-wallet-adapter-base';

const SendPage: NextPageWithLayout = () => {
  const { wallet, publicKey } = useWallet();

  let [toAddress, setToAddress] = useState('');
  let [amount, setAmount] = useState<number | undefined>(undefined);
  let [faucetId, setFaucetId] = useState<string>('');
  let [sharePrivately, setSharePrivately] = useState<boolean>(false);
  let [recallBlocks, setRecallBlocks] = useState<number | undefined>();

  let [transactionId, setTransactionId] = useState<string | undefined>(
    undefined
  );
  //let [status, setStatus] = useState<string | undefined>();

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (transactionId) {
      intervalId = setInterval(() => {
        getTransactionStatus(transactionId!);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [transactionId]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!publicKey) throw new WalletNotConnectedError();

    const midenTransaction = new SendTransaction(
      publicKey,
      toAddress,
      faucetId,
      sharePrivately ? 'private' : 'public',
      amount!
    );

    const txId =
      (await (wallet?.adapter as TridentWalletAdapter).requestSend(
        midenTransaction
      )) || '';
    if (event.target?.elements[0]?.value) {
      event.target.elements[0].value = '';
    }
    setTransactionId(txId);
  };

  const getTransactionStatus = async (txId: string) => {
    // const status = await (
    //   wallet?.adapter as TridentWalletAdapter
    // ).transactionStatus(txId);
    // setStatus(status);
  };

  const handleToAddressChange = (event: any) => {
    setTransactionId(undefined);
    event.preventDefault();
    setToAddress(event.currentTarget.value);
  };
  const handleFaucetIdChange = (event: any) => {
    setTransactionId(undefined);
    event.preventDefault();
    setFaucetId(event.currentTarget.value);
  };
  const handleAmountChange = (event: any) => {
    setTransactionId(undefined);
    event.preventDefault();
    setAmount(event.currentTarget.value);
  };
  const handleRecallBlocksChange = (event: any) => {
    setTransactionId(undefined);
    event.preventDefault();
    setRecallBlocks(event.currentTarget.value);
  };

  return (
    <>
      <NextSeo
        title="Trident Wallet Request Send"
        description="Request Send from the Trident Wallet"
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
              placeholder="To address (e.g., 0x0b8a174d47e79b1000088ad423474e)"
              autoComplete="off"
              onChange={(event: FormEvent<Element>) =>
                handleToAddressChange(event)
              }
              value={toAddress}
            />
            <span className="pointer-events-none absolute flex h-full w-8 cursor-pointer items-center justify-center text-gray-600 hover:text-gray-900 ltr:left-0 ltr:pl-2 rtl:right-0 rtl:pr-2 dark:text-gray-500 sm:ltr:pl-3 sm:rtl:pr-3">
              <Check className="h-4 w-4" />
            </span>
          </label>
          <label className="flex w-full items-center py-4">
            <input
              className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
              placeholder="Faucet ID (e.g., 0xe727df7d6b3c6220000054d5f6b3b4)"
              autoComplete="off"
              onChange={(event: FormEvent<Element>) =>
                handleFaucetIdChange(event)
              }
              value={faucetId}
            />
            <span className="pointer-events-none absolute flex h-full w-8 cursor-pointer items-center justify-center text-gray-600 hover:text-gray-900 ltr:left-0 ltr:pl-2 rtl:right-0 rtl:pr-2 dark:text-gray-500 sm:ltr:pl-3 sm:rtl:pr-3">
              <Check className="h-4 w-4" />
            </span>
          </label>
          <label className="flex w-full items-center py-4">
            <input
              className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
              placeholder="Amount (e.g., 101)"
              autoComplete="off"
              onChange={(event: FormEvent<Element>) =>
                handleAmountChange(event)
              }
              value={amount}
            />
            <span className="pointer-events-none absolute flex h-full w-8 cursor-pointer items-center justify-center text-gray-600 hover:text-gray-900 ltr:left-0 ltr:pl-2 rtl:right-0 rtl:pr-2 dark:text-gray-500 sm:ltr:pl-3 sm:rtl:pr-3">
              <Check className="h-4 w-4" />
            </span>
          </label>
          <label className="flex w-full items-center py-4">
            <input
              className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
              placeholder="Blocks before note can be recalled (e.g., 10)"
              autoComplete="off"
              onChange={(event: FormEvent<Element>) =>
                handleRecallBlocksChange(event)
              }
              value={recallBlocks}
            />
            <span className="pointer-events-none absolute flex h-full w-8 cursor-pointer items-center justify-center text-gray-600 hover:text-gray-900 ltr:left-0 ltr:pl-2 rtl:right-0 rtl:pr-2 dark:text-gray-500 sm:ltr:pl-3 sm:rtl:pr-3">
              <Check className="h-4 w-4" />
            </span>
          </label>
          <label className="flex items-center py-4">
            <span className="mr-8 text-sm text-white">Share Privately</span>
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-none text-gray-700 transition duration-150 ease-in-out"
              onChange={() => setSharePrivately(!sharePrivately)}
              checked={sharePrivately}
            />
          </label>
          <div className="flex items-center justify-center">
            <Button
              disabled={!publicKey || !toAddress || !amount || !faucetId}
              type="submit"
              color="white"
              className="shadow-card dark:bg-gray-700 md:h-10 md:px-5 xl:h-12 xl:px-7"
            >
              {!publicKey ? 'Connect Your Wallet' : 'Submit'}
            </Button>
          </div>
        </form>
        {transactionId && (
          <div className="mt-5 inline-flex w-full items-center rounded-full bg-white shadow-card dark:bg-light-dark xl:mt-6">
            <div className="inline-flex h-full shrink-0 grow-0 items-center rounded-full px-4 text-xs text-white sm:text-sm">
              {/* {`Transaction status: ${status}`} */}
            </div>
          </div>
        )}
      </Base>
    </>
  );
};

SendPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SendPage;
