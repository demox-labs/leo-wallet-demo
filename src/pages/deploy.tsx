import { useState, useEffect, ChangeEvent } from 'react';
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import Base from '@/components/ui/base';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import Button from '@/components/ui/button';
import {
  Deployment,
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from '@demox-labs/aleo-wallet-adapter-base';

const Deploy: NextPageWithLayout = () => {
  const { wallet, publicKey } = useWallet();

  let [program, setProgram] = useState('');
  let [fee, setFee] = useState<number | undefined>();
  let [transactionId, setTransactionId] = useState<string | undefined>();
  let [status, setStatus] = useState<string | undefined>();
  let [feePrivate, setFeeVisibility] = useState(false);

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

  const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!publicKey) throw new WalletNotConnectedError();

    const aleoDeployment = new Deployment(
      publicKey,
      'mainnet',
      program,
      fee!,
      feePrivate // Use public fee
    );

    const txId =
      (await (wallet?.adapter as LeoWalletAdapter).requestDeploy(
        aleoDeployment
      )) || '';
    setTransactionId(txId);
  };

  const getTransactionStatus = async (txId: string) => {
    const status = await (
      wallet?.adapter as LeoWalletAdapter
    ).transactionStatus(txId);
    setStatus(status);
  };

  return (
    <>
      <NextSeo
        title="Deploy Programs"
        description="Deploy Programs with Aleo Wallet"
      />
      <Base>
        <form
          noValidate
          role="search"
          onSubmit={handleSubmit}
          className="relative flex w-full flex-col rounded-full md:w-auto"
        >
          <label className="flex w-full items-center justify-between py-4">
            Program:
            <textarea
              className="w-10/12 appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
              placeholder="The full program code (in aleo instructions)"
              rows={12}
              onChange={(event) => setProgram(event.currentTarget.value)}
              value={program}
            />
          </label>

          <label className="flex w-full items-center justify-between py-4">
            Fee:
            <input
              className="h-11 w-10/12 appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
              placeholder="Fee (in microcredits)"
              onChange={(event) => {
                let valueAsNumber = parseFloat(event.target.value);
                let value = !Number.isNaN(valueAsNumber)
                  ? valueAsNumber
                  : undefined;
                setFee(value);
              }}
              value={fee ?? ''}
            />
          </label>
          <label className="flex items-center py-4">
            <span className="mr-8 text-sm text-white">Public Fee</span>
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-gray-700 transition duration-150 ease-in-out"
              onChange={() => setFeeVisibility(!feePrivate)}
              checked={!feePrivate}
            />
          </label>
          <div className="flex items-center justify-center">
            <Button
              disabled={!publicKey || !program || fee === undefined}
              type="submit"
              className="shadow-card dark:bg-gray-700 md:h-10 md:px-5 xl:h-12 xl:px-7"
            >
              {!publicKey ? 'Connect Your Wallet' : 'Submit'}
            </Button>
          </div>
        </form>

        {transactionId && (
          <div>
            <div>{`Deployment status: ${status}`}</div>
          </div>
        )}
      </Base>
    </>
  );
};

Deploy.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Deploy;
