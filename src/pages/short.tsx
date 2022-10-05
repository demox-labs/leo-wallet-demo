import { useState, useEffect } from 'react';
import type { NextPageWithLayout } from '@/types';
import cn from 'classnames';
import { NextSeo } from 'next-seo';
import Button from '@/components/ui/button';
import CoinInput from '@/components/ui/coin-input';
import TransactionInfo from '@/components/ui/transaction-info';
import { SwapIcon } from '@/components/icons/swap-icon';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import Trade from '@/components/ui/trade';
import { connectAccountToMango } from '@/utils/ConnectAccountToMango';
import { useConnection, useWallet, Wallet } from '@solana/wallet-adapter-react';
import { coinList } from '@/data/static/coin-list';
import { getPrices } from '@/utils/GetMangoPrices';
import { PublicKey } from '@solana/web3.js';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import { TokenType } from '@/utils/TokenType';
import { closeMangoAccount } from '@/utils/CloseMangoAccounts';
import { PerpType } from '@/utils/PerpType';
import { createPerp } from '@/utils/CreatePerp';

const DefaultShortCoinIdx = 0;
const DefaultDepositCoinIdx = 1;

const ShortPage: NextPageWithLayout = () => {
  let [perpCoin, setPerpCoin] = useState(coinList[DefaultShortCoinIdx]);
  let [perpAmount, setPerpAmount] = useState(0);
  let [depositCoin, setDepositCoin] = useState(coinList[DefaultDepositCoinIdx]);
  let [depositAmount, setDepositAmount] = useState(0);
  let [prices, setPrices] = useState(new Map<string, number>());

  const { connection } = useConnection();
  const { wallet, publicKey, sendTransaction, signAllTransactions } =
    useWallet();

  const handleAmountUpdate = (
    data: { coin: String; value: String },
    updateFunc: (value: SetStateAction<number>) => void
  ) => {
    let amount = 0;
    try {
      amount = parseFloat(data.value.toString());
    } catch {
      console.log("Couldn't parse amount");
    }
    updateFunc(amount);
  };

  const handleCoinUpdate = (
    data: { coin: String },
    updateFunc: Dispatch<
      SetStateAction<{
        icon: JSX.Element;
        code: string;
        name: string;
        price: number;
        mint: PublicKey;
      }>
    >
  ) => {
    const newCoin = coinList.find((coin) => coin.code == data.coin);
    updateFunc(newCoin!);
  };

  const handleCloseMangoAccount = async () => {
    if (!publicKey) {
      console.log('No public key provided.');
      return;
    }

    console.log(`Attempting to close one mango account.`);

    // should put in the mango account PK, but will just delete the first existing mango account for now
    await closeMangoAccount(null, wallet!);
  };

  const handleOpenMarketPerp = async (perpType: PerpType) => {
    if (!publicKey) {
      console.log('No public key provided.');
      return;
    }

    const prices = await getPrices();
    const perpPrice = prices.get(perpCoin.code);

    console.log(`Attempting to open ${perpType.toString()} perp position.`);

    await createPerp(
      wallet!,
      depositCoin.code as TokenType,
      depositAmount,
      perpCoin.code as TokenType,
      perpAmount,
      perpPrice!,
      perpType
    );
  };

  const handleCreateMangoAccount = async () => {
    if (!publicKey) {
      console.log('No public key provided.');
      return;
    }

    console.log(`Attempting to deposit ${depositAmount} ${depositCoin.code}`);

    await connectAccountToMango(
      wallet as Wallet,
      depositCoin.code as TokenType,
      depositAmount
    );
  };

  useEffect(() => {
    console.log('Getting prices...');
    getPrices().then((prices) => {
      setPrices(prices);
      console.log('Found prices: ', prices);
    });
  }, [perpCoin, depositCoin]);

  const perpAmountUSD = prices.get(perpCoin.code)! * perpAmount;
  const depositAmountUSD = prices.get(depositCoin.code)! * depositAmount;

  return (
    <>
      <NextSeo
        title="PerpNation"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <Trade>
        <div className="mb-5 border-b border-dashed border-gray-200 pb-5 dark:border-gray-800 xs:mb-7 xs:pb-6">
          <div className={cn('relative flex gap-3', 'flex-col')}>
            <CoinInput
              label={'Perping'}
              exchangeRate={perpAmountUSD}
              defaultCoinIndex={DefaultShortCoinIdx}
              getCoinValue={(param) => handleAmountUpdate(param, setPerpAmount)}
              getSelectedCoin={(param) => handleCoinUpdate(param, setPerpCoin)}
            />
            <CoinInput
              label={'Deposit'}
              exchangeRate={depositAmountUSD}
              defaultCoinIndex={DefaultDepositCoinIdx}
              getCoinValue={(param) =>
                handleAmountUpdate(param, setDepositAmount)
              }
              getSelectedCoin={(param) =>
                handleCoinUpdate(param, setDepositCoin)
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 xs:gap-[18px]">
          <TransactionInfo label={'Min. Received'} />
          <TransactionInfo label={'Rate'} />
          <TransactionInfo label={'Offered by'} />
          <TransactionInfo label={'Price Slippage'} value={'1%'} />
          <TransactionInfo label={'Network Fee'} />
          <TransactionInfo label={'Criptic Fee'} />
        </div>
        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
          onClick={() => handleCreateMangoAccount()}
        >
          Connect Account to Mango
        </Button>
        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
          onClick={() => handleCloseMangoAccount()}
        >
          Disconnect One Account from Mango
        </Button>
        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
          onClick={() => handleOpenMarketPerp(PerpType.Short)}
        >
          Open Market Short
        </Button>
        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
          onClick={() => handleOpenMarketPerp(PerpType.Long)}
        >
          Open Market Long
        </Button>
      </Trade>
    </>
  );
};

ShortPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ShortPage;
