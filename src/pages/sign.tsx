import { useState, useEffect, FormEvent, SyntheticEvent } from 'react';
import type { NextPageWithLayout } from '@/types';
import cn from 'classnames';
import { NextSeo } from 'next-seo';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import Trade from '@/components/ui/trade';
import { useWallet, Wallet, LeoWalletAdapter } from 'leo-wallet-adapter';
import { Check } from '@/components/icons/check';

const SignPage: NextPageWithLayout = () => {
  const { wallet, publicKey, sendTransaction, signAllTransactions } =
    useWallet();
  let [message, setMessage] = useState('');
  console.log(publicKey);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const bytes = new TextEncoder().encode(message);
    const signatureBytes = await (
      wallet?.adapter as LeoWalletAdapter
    ).signMessage(bytes);
    const signature = new TextDecoder().decode(signatureBytes);
    setMessage('');
    alert(signature);
  };

  const handleChange = (event: any) => {
    event.preventDefault();
    setMessage(event.currentTarget.value);
  };

  return (
    <>
      <NextSeo
        title="PerpNation"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <Trade>
        <form
          className="relative flex w-full rounded-full md:w-auto lg:w-64 xl:w-80"
          noValidate
          role="search"
          onSubmit={async (event: SyntheticEvent<HTMLFormElement>) => {
            await handleSubmit(event);
          }}
        >
          <label className="flex w-full items-center">
            <input
              className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
              placeholder="Message to Sign"
              autoComplete="off"
              onChange={(event: FormEvent<Element>) => handleChange(event)}
            />
            <span className="pointer-events-none absolute flex h-full w-8 cursor-pointer items-center justify-center text-gray-600 hover:text-gray-900 ltr:left-0 ltr:pl-2 rtl:right-0 rtl:pr-2 dark:text-gray-500 sm:ltr:pl-3 sm:rtl:pr-3">
              <Check className="h-4 w-4" />
            </span>
            <input type="submit" value="Submit" />
          </label>
        </form>
      </Trade>
    </>
  );
};

SignPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SignPage;
