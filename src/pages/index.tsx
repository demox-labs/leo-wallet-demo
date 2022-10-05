import { useState } from 'react';
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Button from '@/components/ui/button';
import routes from '@/config/routes';

type SectionProps = {
  title: string;
  bgColor: string;
};

function Section({
  title,
  bgColor,
  children,
}: React.PropsWithChildren<SectionProps>) {
  return (
    <div className="mb-3">
      <div className={`rounded-lg ${bgColor}`}>
        <div className="relative flex items-center justify-between gap-4 p-4">
          <div className="flex items-center ltr:mr-6 rtl:ml-6">
            <div>
              <span className="block text-xs font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:text-sm">
                {title}
              </span>
              <span className="mt-1 hidden text-xs tracking-tighter text-gray-600 dark:text-gray-400 sm:block">
                {children}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const GettingStartedPage: NextPageWithLayout = () => {
  return (
    <>
      <NextSeo
        title="Short Kings | Getting Started"
        description="How to get started shorting with short kings"
      />
      <div className="mx-auto w-full px-4 pt-8 pb-14 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8 xl:px-10 2xl:px-0">
        <h2 className="mb-6 text-lg font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:mb-10 sm:text-2xl">
          Getting Started
        </h2>
        <Section
          title="STEP 1 - GET A WALLET"
          bgColor="bg-white shadow-card dark:bg-light-dark"
        >
          &bull; Download and Install a Solana compatible wallet. We recommend{' '}
          <a href="https://phantom.app/">Phantom</a>
        </Section>
        <Section title="STEP 2 - CREATE A NEW WALLET ACCOUNT" bgColor="">
          &bull; Once installed - click on &quot;Create a new wallet&quot;{' '}
          <br />
          &bull; Type in your password <br />
          &bull; Save the provided Secret Recovery Phrase somewhere safe and
          finish creating your account. Never share this phrase.
        </Section>
        <Section
          title="STEP 3 - LOAD MONEY INTO PHANTOM"
          bgColor="bg-white shadow-card dark:bg-light-dark"
        >
          &bull; Open Phantom and then go to - Deposit {'>'} Buy or Transfer{' '}
          {'>'} Moonpay <br />
          &bull; Under &quot;I want to buy&quot;, select &quot;SOL&quot; <br />
          &bull; Checkout with Moonpay
        </Section>
        <Section title="STEP 4 - CONNECT YOUR WALLET" bgColor="">
          &bull; Now that you have your wallet setup with funds, connect it to
          our site by clicking the button below <br />
          <br />
          <WalletMultiButton className="bg-[#512da8]" />
        </Section>
        <Section
          title="STEP 5 - START SHORTING"
          bgColor="bg-white shadow-card dark:bg-light-dark"
        >
          &bull; Click on the button below to start creating your first short!{' '}
          <br /> <br />
          <a href={`${routes.short}`}>
            <Button>Start Shorting</Button>
          </a>
        </Section>
      </div>
    </>
  );
};

GettingStartedPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default GettingStartedPage;
