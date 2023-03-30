import { useState, FormEvent, SyntheticEvent } from 'react';
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import Trade from '@/components/ui/trade';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { Check } from '@/components/icons/check';
import Button from '@/components/ui/button';
import { WalletNotConnectedError } from '@demox-labs/aleo-wallet-adapter-base';

interface RecordsPageProps {
  initialProgram: string;
}

const RecordsPage: NextPageWithLayout<RecordsPageProps> = ({
  initialProgram = '',
}) => {
  const { wallet, publicKey, requestRecords } = useWallet();

  let [program, setProgram] = useState(initialProgram);
  let [recordsPayload, setRecordsPayload] = useState<JSX.Element | null>();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!publicKey) throw new WalletNotConnectedError();

    const records = (await requestRecords!(program)) || '';
    if (event.target?.elements[0]?.value) {
      event.target.elements[0].value = '';
    }
    const recordsFormatted = records.map((rec) => JSON.stringify(rec, null, 2));
    const recordsElement = (
      <textarea className="w-full text-gray-500" style={{ height: '250px' }}>
        {recordsFormatted.join('\n')}
      </textarea>
    );
    setRecordsPayload(recordsElement);
  };

  const handleChange = (event: any) => {
    event.preventDefault();
    setProgram(event.currentTarget.value);
  };

  return (
    <>
      <NextSeo
        title="Leo Wallet Request Records"
        description="Request Records from the Leo Wallet"
      />
      <Trade>
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
              placeholder="Program, ie: credits.aleo"
              autoComplete="off"
              onChange={(event: FormEvent<Element>) => handleChange(event)}
              value={program}
            />
            <span className="pointer-events-none absolute flex h-full w-8 cursor-pointer items-center justify-center text-gray-600 hover:text-gray-900 ltr:left-0 ltr:pl-2 rtl:right-0 rtl:pr-2 dark:text-gray-500 sm:ltr:pl-3 sm:rtl:pr-3">
              <Check className="h-4 w-4" />
            </span>
            <Button
              disabled={!publicKey || program.length < 1}
              type="submit"
              color="white"
              className="ml-4 shadow-card dark:bg-gray-700 md:h-10 md:px-5 xl:h-12 xl:px-7"
            >
              {!publicKey ? 'Connect Your Wallet' : 'Request'}
            </Button>
          </label>
        </form>
        {recordsPayload && (
          <div
            className="mt-5 inline-flex w-full items-center rounded-full bg-white shadow-card dark:bg-light-dark xl:mt-6"
            style={{ height: '250px' }}
          >
            <div className="inline-flex h-full shrink-0 grow-0 items-center rounded-full px-4 text-xs text-white sm:text-sm">
              Records:
            </div>
            <div className="text w-full truncate text-ellipsis bg-center text-xs text-gray-500 ltr:pl-4 rtl:pr-4 dark:text-gray-300 sm:text-sm">
              {recordsPayload}
            </div>
          </div>
        )}
      </Trade>
    </>
  );
};

RecordsPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default RecordsPage;
