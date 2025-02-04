import type { AppProps } from 'next/app';
import type { NextPageWithLayout } from '@/types';
import { useMemo, useState } from 'react';
import Head from 'next/head';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider } from 'next-themes';
import ModalsContainer from '@/components/modal-views/container';
import DrawersContainer from '@/components/drawer-views/container';
// base css file
import 'swiper/css';
import '@/assets/css/scrollbar.css';
import '@/assets/css/globals.css';
import '@/assets/css/range-slider.css';
import { TridentWalletAdapter } from '@demox-labs/miden-wallet-adapter-trident';
import { DecryptPermission } from '@demox-labs/miden-wallet-adapter-base';
import { WalletProvider } from '@demox-labs/miden-wallet-adapter-react';
import { WalletModalProvider } from '@demox-labs/miden-wallet-adapter-reactui';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  const wallets = useMemo(
    () => [
      new TridentWalletAdapter({
        appName: 'Trident Demo App',
      }),
    ],
    []
  );
  const [queryClient] = useState(() => new QueryClient());
  const getLayout = Component.getLayout ?? ((page) => page);
  //could remove this if you don't need to page level layout
  return (
    <>
      <Head>
        {/* maximum-scale 1 meta tag need to prevent ios input focus auto zooming */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 maximum-scale=1"
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <WalletProvider
            wallets={wallets}
            decryptPermission={DecryptPermission.UponRequest}
            autoConnect
          >
            <WalletModalProvider>
              <ThemeProvider
                attribute="class"
                enableSystem={false}
                defaultTheme="dark"
              >
                {getLayout(<Component {...pageProps} />)}
                <ModalsContainer />
                <DrawersContainer />
              </ThemeProvider>
            </WalletModalProvider>
          </WalletProvider>
        </Hydrate>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </>
  );
}

export default CustomApp;
