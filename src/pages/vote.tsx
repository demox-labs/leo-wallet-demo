import type { NextPageWithLayout } from '@/types';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import routes from '@/config/routes';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import Image from '@/components/ui/image';
// static data
import votePool from '@/assets/images/vote-pool.svg';
import discord from '@/assets/images/discord.svg';
import forum from '@/assets/images/forum.svg';
import bank from '@/assets/images/bank.svg';
import mirror from '@/assets/images/mirror.svg';

const VotePage: NextPageWithLayout = () => {
  const router = useRouter();
  return (
    <>
      <NextSeo
        title="Vote"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <div className="mx-auto w-full max-w-[1160px] text-sm md:pt-14 4xl:pt-24">
        <div className="grid grid-cols-1 gap-6 xs:grid-cols-2 lg:grid-cols-3">
          <motion.div
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.015 }}
            onClick={() => router.push(routes.proposals)}
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg bg-white p-6 text-center shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark xs:col-span-2 sm:col-auto sm:row-span-2"
          >
            <div className="h-auto w-16 xs:w-20 xl:w-24 3xl:w-28 4xl:w-auto">
              <Image alt="Vote Pool" src={votePool} />
            </div>
            <h3 className="mt-6 mb-2 text-sm font-medium uppercase text-gray-800 dark:text-gray-100 sm:text-base 3xl:text-lg">
              Vote with Pool
            </h3>
            <p className="leading-loose text-gray-600 dark:text-gray-400">
              Vote with POOL tokens held{' '}
              <br className="hidden xs:inline-block" /> in your wallet or
              delegated <br className="hidden xs:inline-block" /> to you.
            </p>
          </motion.div>
          <motion.a
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.015 }}
            target="_blank"
            rel="noopener noreferrer"
            href="https://discord.com/"
            className="rounded-lg bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark"
          >
            <span className="inline-block h-auto w-12 sm:w-auto">
              <Image alt="Discord" src={discord} />
            </span>
            <h3 className="mt-6 text-sm font-medium uppercase text-purple-600 sm:mt-8 sm:text-base 3xl:mt-11 3xl:text-lg">
              Chat on Discord
            </h3>
          </motion.a>
          <motion.a
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.015 }}
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.discourse.org/"
            className="rounded-lg bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark"
          >
            <span className="inline-block h-auto w-12 sm:w-auto">
              <Image alt="Forum" src={forum} />
            </span>
            <h3 className="mt-6 text-sm font-medium uppercase text-orange-500 sm:mt-8 sm:text-base 3xl:mt-11 3xl:text-lg">
              Join the Forum
            </h3>
          </motion.a>
          <motion.div
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.015 }}
            onClick={() => router.push('/')}
            className="cursor-pointer rounded-lg bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark"
          >
            <div className="h-auto w-12 sm:w-auto">
              <Image alt="Bank" src={bank} />
            </div>
            <h3 className="mt-6 text-sm font-medium uppercase text-blue-500 sm:mt-8 sm:text-base 3xl:mt-11 3xl:text-lg">
              View Documentation
            </h3>
          </motion.div>
          <motion.a
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.015 }}
            target="_blank"
            rel="noopener noreferrer"
            href="https://forum.mirror.finance/"
            className="rounded-lg bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark"
          >
            <span className="inline-block h-auto w-11 sm:w-auto">
              <Image alt="Mirror" src={mirror} />
            </span>
            <h3 className="mt-6 text-sm font-medium uppercase text-gray-400 sm:mt-8 sm:text-base 3xl:mt-11 3xl:text-lg">
              Read on mirror
            </h3>
          </motion.a>
        </div>
      </div>
    </>
  );
};

VotePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default VotePage;
