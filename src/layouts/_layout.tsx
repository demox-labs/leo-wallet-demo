import { useWindowScroll } from '@/lib/hooks/use-window-scroll';
import Logo from '@/components/ui/logo';
import SearchButton from '@/components/search/button';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useDrawer } from '@/components/drawer-views/context';
import {
  AleoDAppDecryptPermission,
  LeoWalletAdapter,
  WalletAdapterNetwork,
  WalletModalProvider,
  WalletMultiButton,
  WalletProvider,
} from '@demox-labs/aleo-wallet-adapter';
import Hamburger from '@/components/ui/hamburger';
import { MenuItems } from '@/layouts/_layout-menu';
import React, { FC, useMemo } from 'react';

require('@demox-labs/aleo-wallet-adapter/dist/ui/styles.css');

function HeaderRightArea() {
  const isMounted = useIsMounted();
  const breakpoint = useBreakpoint();
  const { openDrawer, isOpen } = useDrawer();
  return (
    <div className="order-last flex shrink-0 items-center">
      <div className="ltr:mr-3.5 rtl:ml-3.5 ltr:sm:mr-5 rtl:sm:ml-5 xl:hidden">
        <SearchButton
          color="white"
          className="shadow-main dark:border dark:border-solid dark:border-gray-700 dark:bg-light-dark dark:text-white"
        />
      </div>

      <div className="hidden gap-3 sm:gap-6 lg:flex lg:gap-8">
        {isMounted && ['xs', 'sm', 'md', 'lg'].indexOf(breakpoint) == -1 && (
          <div>
            <SearchButton variant="transparent" className="dark:text-white" />
          </div>
        )}
        <WalletMultiButton className="bg-[#1253fa]" />
      </div>

      <div className="lg:hidden">
        <Hamburger
          isOpen={isOpen}
          onClick={() => openDrawer('DRAWER_MENU')}
          color="white"
          className="shadow-main dark:border dark:border-solid dark:border-gray-700 dark:bg-light-dark dark:text-white"
        />
      </div>
    </div>
  );
}

export function Header() {
  const windowScroll = useWindowScroll();
  const breakpoint = useBreakpoint();
  const isMounted = useIsMounted();
  const { openDrawer, isOpen } = useDrawer();

  return (
    <nav
      className={`fixed top-0 z-30 flex w-full items-center justify-between px-4 transition-all duration-300 ltr:right-0 rtl:left-0 sm:px-6 lg:px-8 xl:px-10 3xl:px-12 ${
        isMounted && windowScroll.y > 10
          ? 'h-16 bg-gradient-to-b from-white to-white/80 shadow-card backdrop-blur dark:from-dark dark:to-dark/80 sm:h-20'
          : 'h-16 bg-body dark:bg-dark sm:h-24'
      }`}
    >
      {/* <div className="w-80 2xl:w-[368px]"></div> */}
      <div className="flex items-center">
        <div className="hidden lg:mr-6 lg:block xl:hidden">
          <Hamburger
            isOpen={isOpen}
            onClick={() => openDrawer('DRAWER_MENU')}
            color="white"
            className="shadow-main dark:border dark:border-solid dark:border-gray-700 dark:bg-light-dark dark:text-white"
          />
        </div>
        <Logo />
        {isMounted && ['xs', 'sm', 'md', 'lg'].indexOf(breakpoint) == -1 && (
          <MenuItems />
        )}
      </div>

      <HeaderRightArea />
    </nav>
  );
}

interface LayoutProps {}

export default function Layout({
  children,
}: React.PropsWithChildren<LayoutProps>) {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Mainnet;

  // You can also provide a custom RPC endpoint.
  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: 'Leo Demo App',
        decryptPermission: AleoDAppDecryptPermission.UponRequest,
      }),
    ],
    []
  );

  return (
    <div className="bg-light-100 dark:bg-dark-100 flex min-h-screen flex-col">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Header />
          <main className="mb-12 flex flex-grow flex-col pt-16 sm:pt-24">
            {children}
          </main>
        </WalletModalProvider>
      </WalletProvider>
    </div>
  );
}
