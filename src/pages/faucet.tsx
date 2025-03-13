import { useState, FormEvent, SyntheticEvent, useEffect } from 'react';
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import Base from '@/components/ui/base';
import { useWallet } from '@demox-labs/miden-wallet-adapter-react';
import { TridentWalletAdapter } from '@demox-labs/miden-wallet-adapter-trident';
import { Check } from '@/components/icons/check';
import Button from '@/components/ui/button';
import {
  Transaction,
  WalletNotConnectedError,
} from '@demox-labs/miden-wallet-adapter-base';
import { useMidenSdk } from '@/lib/hooks/use-miden-sdk';

const FaucetPage: NextPageWithLayout = () => {
  const { wallet, publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | undefined>();
  let [toAddress, setToAddress] = useState('');
  let [transactionId, setTransactionId] = useState<string | undefined>(
    undefined
  );

  const { client, Miden, faucetId, createFaucet } = useMidenSdk();

  let [amount, setAmount] = useState<number | undefined>(100);
  let [sharePrivately, setSharePrivately] = useState<boolean>(false);

  useEffect(() => {
    if (faucetId) {
      return;
    }
    createFaucet();
  }, [createFaucet, faucetId]);

  const handleToAddressChange = (event: any) => {
    setTransactionId(undefined);
    event.preventDefault();
    setToAddress(event.currentTarget.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!toAddress) throw new WalletNotConnectedError();
    if (!Miden || !client || !faucetId) return;
    setIsLoading(true);

    await client.fetch_and_cache_account_auth_by_pub_key(faucetId);
    const accountId = Miden.AccountId.from_hex(toAddress);
    const noteType = sharePrivately
      ? Miden.NoteType.private()
      : Miden.NoteType.public();
    setStatus('Minting note...');
    const mintTxn = await client.new_mint_transaction(
      accountId,
      faucetId,
      noteType,
      BigInt(amount!)
    );
    // setStatus('Generating transaction...');
    // const noteId = mintTxn.created_notes().notes()[0].id();
    // const noteIdString = noteId.to_string();
    // const noteIdArgsArray = new Miden.NoteIdAndArgsArray([
    //   new Miden.NoteIdAndArgs(noteId),
    // ]);
    // const consumeRequest = new Miden.TransactionRequestBuilder()
    //   .with_authenticated_input_notes(noteIdArgsArray)
    //   .build();

    // let inputNotes: Uint8Array[] = [];
    // if (sharePrivately) {
    //   setStatus('Exporting note...');
    //   const noteBytes = await client.export_note(noteIdString, 'Partial');
    //   const uint8Array = new Uint8Array(noteBytes);
    //   inputNotes = [uint8Array];
    // }
    // const midenTransaction = Transaction.createCustomTransaction(
    //   publicKey,
    //   consumeRequest,
    //   [noteIdString],
    //   inputNotes
    // );

    // setStatus('Submitting transaction request...');
    // const txId =
    //   (await (wallet?.adapter as TridentWalletAdapter).requestTransaction(
    //     midenTransaction
    //   )) || '';
    // setIsLoading(false);
    // setStatus(`Transaction ID: ${txId}`);
    // if (event.target?.elements[0]?.value) {
    //   event.target.elements[0].value = '';
    // }
  };

  const handleAmountChange = (event: any) => {
    event.preventDefault();
    setAmount(event.currentTarget.value);
  };

  return (
    <>
      <NextSeo
        title="Miden Demo Create Faucet"
        description="Send notes from custom faucet in Trident Wallet"
      />
      <Base>
        <div className="inline-flex h-full shrink-0 grow-0 items-center rounded-full text-xs text-white sm:text-sm">
          {faucetId
            ? 'Faucet ID: ' + faucetId.to_string()
            : 'Creating faucet...'}
        </div>
        <form
          className="relative flex w-full flex-col rounded-full md:w-auto"
          noValidate
          role="search"
          onSubmit={async (event: SyntheticEvent<HTMLFormElement>) => {
            await handleSubmit(event);
          }}
        >
          <label className="flex w-full items-center py-4">
            <input
              className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
              placeholder="To address: ie, 0x0b8a174d47e79b1000088ad423474e"
              autoComplete="off"
              onChange={(event: FormEvent<Element>) =>
                handleToAddressChange(event)
              }
              value={toAddress}
            />
            <span className="pointer-events-none absolute flex h-full w-8 cursor-pointer items-center justify-center text-gray-600 hover:text-gray-900 ltr:left-0 ltr:pl-2 rtl:right-0 rtl:pr-2 dark:text-gray-500 sm:ltr:pl-3 sm:rtl:pr-3">
              <Check className="h-4 w-4" />
            </span>
          </label>
          <label className="flex w-full items-center py-4">
            <input
              className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
              placeholder="Amount: ie, 100"
              autoComplete="off"
              onChange={(event: FormEvent<Element>) =>
                handleAmountChange(event)
              }
              value={amount}
            />
            <span className="pointer-events-none absolute flex h-full w-8 cursor-pointer items-center justify-center text-gray-600 hover:text-gray-900 ltr:left-0 ltr:pl-2 rtl:right-0 rtl:pr-2 dark:text-gray-500 sm:ltr:pl-3 sm:rtl:pr-3">
              <Check className="h-4 w-4" />
            </span>
          </label>
          <label className="flex items-center py-4">
            <span className="mr-8 text-sm text-white">Share Privately</span>
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-none text-gray-700 transition duration-150 ease-in-out"
              onChange={() => setSharePrivately(!sharePrivately)}
              checked={sharePrivately}
            />
          </label>
          <div className="flex items-center justify-center">
            <Button
              disabled={!publicKey || !amount || !Miden || !client || !faucetId}
              name="public"
              type="submit"
              color="white"
              className="ml-4 shadow-card dark:bg-gray-700 md:h-10 md:px-5 xl:h-12 xl:px-7"
              isLoading={isLoading}
            >
              {!publicKey
                ? 'Connect Your Wallet'
                : `Mint ${sharePrivately ? 'Private' : 'Public'} Note`}
            </Button>
          </div>
        </form>
        {status && (
          <div className="mt-5 inline-flex w-full items-center rounded-full bg-white shadow-card dark:bg-light-dark xl:mt-6">
            <div className="inline-flex h-full shrink-0 grow-0 items-center rounded-full text-xs text-white sm:text-sm">
              {status}
            </div>
          </div>
        )}
      </Base>
    </>
  );
};

FaucetPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default FaucetPage;
