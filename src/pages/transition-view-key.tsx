import { useState, FormEvent, SyntheticEvent } from 'react';
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import Base from '@/components/ui/base';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import { Check } from '@/components/icons/check';
import Button from '@/components/ui/button';
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard';
import { Copy } from '@/components/icons/copy';
import { WalletNotConnectedError } from '@demox-labs/aleo-wallet-adapter-base';
import { AleoChainId, getTransaction } from '@/lib/aleo/client';
import { ExecuteTransaction } from '@/lib/aleo/types';

const TransitionViewKeyPage: NextPageWithLayout = () => {
  const { wallet, publicKey } = useWallet();

  let [transactionId, setTransactionId] = useState('');
  let [viewKeys, setViewKeys] = useState<string[]>([]);
  let [copyButtonStatus, setCopyButtonStatus] = useState(false);
  let [decryptedTransition, setDecryptedTransition] = useState<any>(null);
  let [_, copyToClipboard] = useCopyToClipboard();

  const handleCopyToClipboard = () => {
    copyToClipboard(viewKeys.join('\n'));
    setCopyButtonStatus(true);
    setTimeout(() => {
      setCopyButtonStatus(false);
    }, 1500);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!publicKey) throw new WalletNotConnectedError();

    const keys =
      (await (wallet?.adapter as LeoWalletAdapter).transitionViewKeys(
        transactionId
      )) || [];
    const transactions =
      (await (wallet?.adapter as LeoWalletAdapter).requestTransactionHistory(
        'credits.aleo'
      )) || [];
    const aleoTransactionId = transactions.filter(
      (tx) => tx.id === transactionId
    )[0].transactionId;
    const aleoTransaction = await getTransaction(
      AleoChainId.Mainnet,
      aleoTransactionId
    );
    const transition = (aleoTransaction.transaction as ExecuteTransaction)
      .execution.transitions[0];
    let { decryptedTransition } = await (
      await fetch(
        `/api/decrypt_transition?transitionViewKey=${
          keys[0]
        }&aleoTransition=${JSON.stringify(transition)}`
      )
    ).json();
    decryptedTransition = JSON.parse(decryptedTransition);
    if (event.target?.elements[0]?.value) {
      event.target.elements[0].value = '';
    }
    setViewKeys(keys);
    setDecryptedTransition(decryptedTransition);
  };

  const handleChange = (event: any) => {
    event.preventDefault();
    setTransactionId(event.currentTarget.value);
  };

  return (
    <>
      <NextSeo
        title="Leo Wallet Transition View Keys"
        description="Get transition view keys with the Leo Wallet"
      />
      <Base>
        <form
          className="relative flex w-full rounded-full md:w-auto"
          noValidate
          role="search"
          onSubmit={async (event: SyntheticEvent<HTMLFormElement>) => {
            await handleSubmit(event);
          }}
        >
          <label className="flex w-full items-center">
            <input
              className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
              placeholder="Transaction ID"
              autoComplete="off"
              onChange={(event: FormEvent<Element>) => handleChange(event)}
            />
            <span className="pointer-events-none absolute flex h-full w-8 cursor-pointer items-center justify-center text-gray-600 hover:text-gray-900 ltr:left-0 ltr:pl-2 rtl:right-0 rtl:pr-2 dark:text-gray-500 sm:ltr:pl-3 sm:rtl:pr-3">
              <Check className="h-4 w-4" />
            </span>
            <Button
              disabled={!publicKey || transactionId.length < 1}
              type="submit"
              color="white"
              className="ml-4 shadow-card dark:bg-gray-700 md:h-10 md:px-5 xl:h-12 xl:px-7"
            >
              {!publicKey ? 'Connect Your Wallet' : 'Get View Keys'}
            </Button>
          </label>
        </form>
        {viewKeys.length > 0 && (
          <div className="mt-5 inline-flex h-9 items-center rounded-full bg-white shadow-card dark:bg-light-dark xl:mt-6">
            <div className="inline-flex h-full shrink-0 grow-0 items-center rounded-full bg-gray-900 px-4 text-xs text-white sm:text-sm">
              View Keys:
            </div>
            <div className="text w-28 grow-0 truncate text-ellipsis bg-center text-xs text-gray-500 ltr:pl-4 rtl:pr-4 dark:text-gray-300 sm:w-32 sm:text-sm">
              {viewKeys.join(', ')}
            </div>
            <div
              className="flex cursor-pointer items-center px-4 text-gray-500 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              title="Copy View Keys"
              onClick={handleCopyToClipboard}
            >
              {copyButtonStatus ? (
                <Check className="h-auto w-3.5 text-green-500" />
              ) : (
                <Copy className="h-auto w-3.5" />
              )}
            </div>
          </div>
        )}
        {decryptedTransition && (
          <div
            className="mt-5 inline-flex w-full items-center rounded-full bg-white shadow-card dark:bg-light-dark xl:mt-6"
            style={{ height: '250px' }}
          >
            <div className="inline-flex h-full shrink-0 grow-0 items-center rounded-full bg-gray-900 px-4 text-xs text-white sm:text-sm">
              Decrypted Transition:
            </div>
            <div
              className="h-full w-full overflow-auto bg-center text-xs text-gray-500 ltr:pl-4 rtl:pr-4 dark:text-gray-300 sm:text-sm"
              style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}
            >
              <pre style={{ margin: 0 }}>
                {JSON.stringify(decryptedTransition, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Base>
    </>
  );
};

TransitionViewKeyPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default TransitionViewKeyPage;
