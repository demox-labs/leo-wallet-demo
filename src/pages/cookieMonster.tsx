import { useState, FormEvent, SyntheticEvent } from 'react';
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import Trade from '@/components/ui/trade';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import { Check } from '@/components/icons/check';
import Button from '@/components/ui/button';
import { Section } from '.';
import {
  Transaction,
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from '@demox-labs/aleo-wallet-adapter-base';
import RecordsPage from './records';

const BakeCookiesPage: NextPageWithLayout = () => {
  const COOKIE_MONSTER_PROGRAM_NAME = 'cookie_monster_14rwsw.aleo';

  const { wallet, publicKey } = useWallet();

  // Bake Cookie State
  let [bakeCookieToAddress, setBakeCookieToAddress] = useState('');
  let [cookieType, setCookieType] = useState<number | undefined>();
  let [cookieDeliciousness, setCookieDeliciousness] = useState<
    number | undefined
  >();
  let [bakeCookieTxPayload, setBakeCookieTxPayload] = useState<string>('');

  // Eat Cookie State
  let [eatCookieRecord, setEatCookieRecord] = useState<string>('');
  let [eatCookieTxPayload, setEatCookieTxPayload] = useState<string>('');

  const handleBakeCookieSubmit = async (event: any) => {
    event.preventDefault();
    if (!publicKey) throw new WalletNotConnectedError();

    const inputs = [
      bakeCookieToAddress,
      `${cookieType}u64`,
      `${cookieDeliciousness}u64`,
    ];

    const aleoTransaction = Transaction.createTransaction(
      publicKey,
      WalletAdapterNetwork.Testnet,
      COOKIE_MONSTER_PROGRAM_NAME,
      'bake_cookie',
      inputs,
      'https://aleo-public.s3.us-west-2.amazonaws.com/testnet3/bake_cookie_with_function_name.prover'
    );

    const txPayload =
      (await (wallet?.adapter as LeoWalletAdapter).requestTransaction(
        aleoTransaction
      )) || '';
    if (event.target?.elements[0]?.value) {
      event.target.elements[0].value = '';
    }
    setBakeCookieTxPayload('Check your wallet to see the cookie transaction');
  };

  const handleEatCookieSubmit = async (event: any) => {
    event.preventDefault();
    if (!publicKey) throw new WalletNotConnectedError();

    const inputs = [JSON.parse(eatCookieRecord)];

    const aleoTransaction = Transaction.createTransaction(
      publicKey,
      WalletAdapterNetwork.Testnet,
      COOKIE_MONSTER_PROGRAM_NAME,
      'eat_cookie',
      inputs,
      'https://aleo-public.s3.us-west-2.amazonaws.com/testnet3/eat_cookie.prover'
    );

    await (wallet?.adapter as LeoWalletAdapter).requestTransaction(
      aleoTransaction
    );
    if (event.target?.elements[0]?.value) {
      event.target.elements[0].value = '';
    }
    setEatCookieTxPayload(
      `Check your wallet to see the transaction. After it completes, check to see if the cookie record has been spent! \n 
      Note: Spent status may take awhile to update.`
    );
  };

  const handleToAddressChange = (event: any) => {
    event.preventDefault();
    setBakeCookieToAddress(event.currentTarget.value);
  };
  const handleCookieTypeChange = (event: any) => {
    event.preventDefault();
    setCookieType(event.currentTarget.value);
  };
  const handleDeliciousnessChange = (event: any) => {
    event.preventDefault();
    setCookieDeliciousness(event.currentTarget.value);
  };
  const handleEatCookieRecordChange = (event: any) => {
    event.preventDefault();
    setEatCookieRecord(event.currentTarget.value);
  };

  return (
    <>
      <NextSeo
        title="Leo Wallet | Cookie Monster example"
        description="Create and consume cookie records via the Leo Wallet"
      />
      <div className="mx-auto w-full px-4 pt-8 pb-14 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8 xl:px-10 2xl:px-0">
        <h2 className="mb-2 text-lg font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:mb-6 sm:text-2xl">
          Cookie Monster example
        </h2>
        <p className="mb-6 hidden w-1/2 text-xs tracking-tighter text-gray-600 dark:text-gray-400 sm:block">
          This is an example of how to use the Leo Wallet to create and consume
          records of an arbitrary program. <br />
          The ability to create arbitrary programs, deploy them to the chainm
          and execute them in a completely privacy preserving way is one of the
          most powerful features of the Aleo blockchain and by utilizing the Leo
          wallet it can be done easily and securely.
        </p>
        <Section
          title="STEP 1 - Bake a cookie"
          bgColor="bg-white shadow-card dark:bg-light-dark"
          sectionWidth="w-1/2"
        >
          <form
            className="relative flex w-full flex-col rounded-full md:w-auto"
            noValidate
            role="search"
            onSubmit={async (event: SyntheticEvent<HTMLFormElement>) => {
              await handleBakeCookieSubmit(event);
            }}
          >
            <p className="mt-6">Address to send cookie: </p>
            <label className="flex w-full items-center py-4">
              <input
                className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
                placeholder="To address: ie, aleo1kf3dgrz9lqyklz8kqfy0hpxxyt78qfuzshuhccl02a5x43x6nqpsaapqru"
                autoComplete="off"
                onChange={(event: FormEvent<Element>) =>
                  handleToAddressChange(event)
                }
                value={bakeCookieToAddress}
              />
              <span className="pointer-events-none absolute flex h-full w-8 cursor-pointer items-center justify-center text-gray-600 hover:text-gray-900 ltr:left-0 ltr:pl-2 rtl:right-0 rtl:pr-2 dark:text-gray-500 sm:ltr:pl-3 sm:rtl:pr-3">
                <Check className="h-4 w-4" />
              </span>
            </label>
            <p className="mt-4">Cookie type: </p>
            <label className="flex w-full items-center py-4">
              <input
                className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
                placeholder="Cookie type as u64"
                autoComplete="off"
                onChange={(event: FormEvent<Element>) =>
                  handleCookieTypeChange(event)
                }
                value={cookieType}
              />
              <span className="pointer-events-none absolute flex h-full w-8 cursor-pointer items-center justify-center text-gray-600 hover:text-gray-900 ltr:left-0 ltr:pl-2 rtl:right-0 rtl:pr-2 dark:text-gray-500 sm:ltr:pl-3 sm:rtl:pr-3">
                <Check className="h-4 w-4" />
              </span>
            </label>
            <p className="mt-4">Cookie deliciousness: </p>
            <label className="flex w-full items-center py-4">
              <input
                className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
                placeholder="How delicious should this cookie be? Use u64"
                autoComplete="off"
                onChange={(event: FormEvent<Element>) =>
                  handleDeliciousnessChange(event)
                }
                value={cookieDeliciousness}
              />
              <span className="pointer-events-none absolute flex h-full w-8 cursor-pointer items-center justify-center text-gray-600 hover:text-gray-900 ltr:left-0 ltr:pl-2 rtl:right-0 rtl:pr-2 dark:text-gray-500 sm:ltr:pl-3 sm:rtl:pr-3">
                <Check className="h-4 w-4" />
              </span>
            </label>
            <div className="flex items-center justify-center">
              <Button
                disabled={!publicKey || bakeCookieToAddress.length < 1}
                type="submit"
                color="white"
                className="shadow-card dark:bg-gray-700 md:h-10 md:px-5 xl:h-12 xl:px-7"
              >
                {!publicKey ? 'Connect Your Wallet' : 'Submit'}
              </Button>
            </div>
          </form>
          {bakeCookieTxPayload && (
            <div className="mt-5 inline-flex w-full items-center rounded-full bg-white shadow-card dark:bg-light-dark xl:mt-6">
              <div className="inline-flex h-full shrink-0 grow-0 items-center rounded-full px-4 text-xs text-white sm:text-sm">
                Check your wallet to see the transaction
              </div>
            </div>
          )}
        </Section>
        <Section title="STEP 2 - GET YOUR COOKIES" bgColor="">
          <RecordsPage
            initialProgram={COOKIE_MONSTER_PROGRAM_NAME}
          ></RecordsPage>
        </Section>
        <Section
          title="STEP 3 - EAT A COOKIE"
          bgColor="bg-white shadow-card dark:bg-light-dark"
          sectionWidth="w-1/2"
        >
          Now that you have baked a cookie and have an unspent cookie record,
          let&apos;s eat it!
          <form
            className="relative flex w-full flex-col rounded-full md:w-auto"
            noValidate
            role="search"
            onSubmit={async (event: SyntheticEvent<HTMLFormElement>) => {
              await handleEatCookieSubmit(event);
            }}
          >
            <p className="mt-6">Cookie record to eat: </p>
            <label className="flex w-full items-center py-4">
              <input
                className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
                placeholder="To address: ie, aleo1kf3dgrz9lqyklz8kqfy0hpxxyt78qfuzshuhccl02a5x43x6nqpsaapqru"
                autoComplete="off"
                onChange={(event: FormEvent<Element>) =>
                  handleEatCookieRecordChange(event)
                }
                value={eatCookieRecord}
              />
              <span className="pointer-events-none absolute flex h-full w-8 cursor-pointer items-center justify-center text-gray-600 hover:text-gray-900 ltr:left-0 ltr:pl-2 rtl:right-0 rtl:pr-2 dark:text-gray-500 sm:ltr:pl-3 sm:rtl:pr-3">
                <Check className="h-4 w-4" />
              </span>
            </label>
            <div className="flex items-center justify-center">
              <Button
                disabled={!publicKey || eatCookieRecord.length < 1}
                type="submit"
                color="white"
                className="shadow-card dark:bg-gray-700 md:h-10 md:px-5 xl:h-12 xl:px-7"
              >
                {!publicKey ? 'Connect Your Wallet' : 'Submit'}
              </Button>
            </div>
          </form>
          {eatCookieTxPayload && (
            <div className="mt-5 inline-flex w-full items-center rounded-full bg-white shadow-card dark:bg-light-dark xl:mt-6">
              <div className="inline-flex h-full shrink-0 grow-0 items-center rounded-full px-4 text-xs text-white sm:text-sm">
                {eatCookieTxPayload}
              </div>
            </div>
          )}
        </Section>
      </div>
    </>
  );
};

BakeCookiesPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default BakeCookiesPage;
