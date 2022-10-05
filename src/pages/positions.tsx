import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import Button from '@/components/ui/button';
import PositionsList from '@/components/positions/list';
import { MangoService, PositionStats } from '@/utils/MangoService';
import { useConnection, useWallet, Wallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';

const PositionsPage: NextPageWithLayout = () => {
  const { connection } = useConnection();
  const { wallet, publicKey, sendTransaction, signAllTransactions } =
    useWallet();

  const [positions, setPositions] = useState([] as PositionStats[]);

  useEffect(() => {
    if (wallet && publicKey) {
      const mangoService = new MangoService(wallet);
      mangoService.getAllMangoAccountsStats().then((positions) => {
        setPositions(positions);
      });
    }
  }, [wallet, publicKey]);

  const settleAndCloseAccount = async (position: PositionStats) => {
    if (wallet && publicKey) {
      const mangoService = new MangoService(wallet);
      const perpType = position.type == 'buy' ? 'sell' : 'buy';
      await mangoService.createPerp(
        position.publicKey,
        perpType,
        position.tokenType,
        position.quantity,
        position.price
      );

      await mangoService.closeMangoAccount(position.publicKey);

      const newPositions = await mangoService.getAllMangoAccountsStats();
      setPositions(newPositions);
    }
  };

  return (
    <>
      <NextSeo
        title="Positions"
        description="Short Kings - Your current open positions"
      />
      <div className="mx-auto w-full sm:pt-8">
        <div className="mb-3 hidden grid-cols-3 gap-6 rounded-lg bg-white shadow-card dark:bg-light-dark sm:grid lg:grid-cols-6">
          <span className="px-8 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">
            Currency
          </span>
          <span className="px-8 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">
            Type
          </span>
          <span className="px-8 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">
            Current Value
          </span>
          <span className="px-8 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">
            Profit / Loss
          </span>
          <span className="hidden px-8 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300 lg:block">
            Liquidation Price
          </span>
          <span className="hidden px-8 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300 lg:block">
            Health %
          </span>
        </div>

        {positions.map((position) => {
          return (
            <PositionsList key={position.publicKey.toString()} {...position}>
              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
                <div className="text-xs font-medium uppercase text-black ltr:text-right rtl:text-left dark:text-white sm:text-sm">
                  Your current position is worth: ${position.equity} with a
                  profit of ${position.pnl.toLocaleString()}
                </div>
                <div className="flex flex-col gap-3 text-xs font-medium uppercase text-black ltr:text-right rtl:text-left dark:text-white sm:text-sm">
                  It will be automatically liquidated if {position.tokenType}{' '}
                  reaches ${position.liqPriceStr}
                </div>
              </div>
              <Button
                shape="rounded"
                fullWidth
                size="large"
                onClick={() => {
                  settleAndCloseAccount(position);
                }}
              >
                CLOSE POSITION
              </Button>
            </PositionsList>
          );
        })}

        {positions.length == 0 && (
          <div
            className="relative mb-3 overflow-hidden rounded-lg bg-white shadow-card transition-all last:mb-0 hover:shadow-large dark:bg-light-dark"
            style={{ textAlign: 'center' }}
          >
            <div className="relative grid h-auto cursor-pointer items-center sm:h-20">
              You currently have no open positions
            </div>
          </div>
        )}
      </div>
    </>
  );
};

PositionsPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default PositionsPage;
