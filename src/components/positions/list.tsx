// @ts-nocheck
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TransactionInfo from '@/components/ui/transaction-info';
import { PositionStats } from '@/utils/MangoService';
import { coinList } from '@/data/static/coin-list';

export default function PositionsList({
  publicKey,
  equity,
  healthRatio,
  pnl,
  liqPriceStr,
  tokenType,
  price,
  type,
  children,
}: React.PropsWithChildren<PositionStats>) {
  let [isExpand, setIsExpand] = useState(false);
  const from = coinList.find((coin) => coin.code == tokenType);
  const [typeText, typeColor] =
    type == 'buy' ? ['Long', 'text-green-500'] : ['Short', 'text-red-500'];
  const pnlColor = pnl >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div className="relative mb-3 overflow-hidden rounded-lg bg-white shadow-card transition-all last:mb-0 hover:shadow-large dark:bg-light-dark">
      <div
        className="relative grid h-auto cursor-pointer grid-cols-2 items-center gap-3 py-4 sm:h-20 sm:grid-cols-3 sm:gap-6 sm:py-0 lg:grid-cols-6"
        onClick={() => setIsExpand(!isExpand)}
      >
        <div className="col-span-2 px-4 sm:col-auto sm:px-8">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="relative">{from!.icon}</div>
            </div>
            <div className="whitespace-nowrap text-sm font-medium uppercase text-black ltr:ml-3 rtl:mr-3 dark:text-white">
              {from.code}: ${price.toLocaleString()}
            </div>
          </div>
        </div>
        <div
          className={`px-4 text-xs font-medium uppercase tracking-wider  sm:px-8 sm:text-sm ${typeColor}`}
        >
          <span className={`mb-1 block font-medium sm:hidden ${typeColor}`}>
            Type
          </span>
          {typeText}
        </div>
        <div className="px-4 text-xs font-medium uppercase tracking-wider text-black dark:text-white sm:px-8 sm:text-sm">
          <span className="mb-1 block font-medium text-gray-600 dark:text-gray-400 sm:hidden">
            Equity
          </span>
          ${equity}
        </div>
        <div
          className={`px-4 text-xs font-medium uppercase tracking-wider ${pnlColor} sm:px-8 sm:text-sm`}
        >
          <span className={`mb-1 block font-medium ${pnlColor} sm:hidden`}>
            Profit
          </span>
          ${pnl.toLocaleString()}
        </div>
        <div className="hidden px-4 text-xs font-medium uppercase tracking-wider text-black dark:text-white sm:px-8 sm:text-sm lg:block">
          ${liqPriceStr}
        </div>
        <div className="hidden px-4 text-xs font-medium uppercase tracking-wider text-black dark:text-white sm:px-8 sm:text-sm lg:block">
          {healthRatio}%
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isExpand && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <div className="border-t border-dashed border-gray-200 px-4 py-4 dark:border-gray-700 sm:px-8 sm:py-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
