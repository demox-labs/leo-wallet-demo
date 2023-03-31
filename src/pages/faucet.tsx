import { useState, FormEvent, SyntheticEvent } from 'react';
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import Trade from '@/components/ui/trade';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import { Check } from '@/components/icons/check';
import Button from '@/components/ui/button';
import {
  Transaction,
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from '@demox-labs/aleo-wallet-adapter-base';

const FaucetPage: NextPageWithLayout = () => {
  const { wallet, publicKey } = useWallet();

  let [txPayload, setTxPayload] = useState<string>('');

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!publicKey) throw new WalletNotConnectedError();

    const inputs = [publicKey, `100000000u64`];
    const aleoTransaction = Transaction.createTransaction(
      publicKey,
      WalletAdapterNetwork.Testnet,
      'credits.aleo',
      'mint',
      inputs,
      'https://aleo-public.s3.us-west-2.amazonaws.com/testnet3/mint.prover.11fa6f2'
    );

    const txPayload =
      (await (wallet?.adapter as LeoWalletAdapter).requestTransaction(
        aleoTransaction
      )) || '';
    if (event.target?.elements[0]?.value) {
      event.target.elements[0].value = '';
    }
    setTxPayload('Check your wallet to see the transaction');
  };

  return (
    <>
      <NextSeo
        title="Leo Wallet Request Records"
        description="Request Records from the Leo Wallet"
      />
      <Trade>
        <form
          className="relative flex w-full flex-col rounded-full md:w-auto"
          noValidate
          role="search"
          onSubmit={async (event: SyntheticEvent<HTMLFormElement>) => {
            await handleSubmit(event);
          }}
        >
          <div className="flex items-center justify-center">
            <Button
              disabled={!publicKey}
              type="submit"
              color="white"
              className="shadow-card dark:bg-gray-700 md:h-10 md:px-5 xl:h-12 xl:px-7"
            >
              {!publicKey ? 'Connect Your Wallet' : 'GET 100 Aleo Credits'}
            </Button>
          </div>
        </form>
        {txPayload && (
          <div className="mt-5 flex w-full flex-col items-center rounded-full bg-white shadow-card dark:bg-light-dark xl:mt-6">
            <div className="inline-flex h-full shrink-0 grow-0 items-center rounded-full px-4 text-xs text-white sm:text-sm">
              Check your wallet to see the transaction <br />
              <br />
            </div>
            <div>
              <Button
                onClick={() => window.open('https://twitter.com/theLeoWallet')}
                color="white"
                className="shadow-card dark:bg-gray-700 md:h-10 md:px-5 xl:h-12 xl:px-7"
              >
                Follow us on Twitter
              </Button>
            </div>
          </div>
        )}
      </Trade>
    </>
  );
};

FaucetPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default FaucetPage;
