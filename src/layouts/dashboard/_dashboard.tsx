import { useState } from 'react';
import cn from 'classnames';
import { useWindowScroll } from '@/lib/hooks/use-window-scroll';
import Hamburger from '@/components/ui/hamburger';
import {
  LeoWalletAdapter,
  WalletAdapterNetwork,
  WalletModalProvider,
  WalletMultiButton,
  WalletProvider,
} from '@demox-labs/leo-wallet-adapter';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useDrawer } from '@/components/drawer-views/context';
import Sidebar from '@/layouts/dashboard/_sidebar';
import React, { FC, useMemo } from 'react';

require('@demox-labs/leo-wallet-adapter/dist/ui/styles.css');

function HeaderRightArea() {
  return (
    <div className="relative order-last flex shrink-0 items-center gap-3 sm:gap-6 lg:gap-8">
      <WalletMultiButton className="bg-[#1253fa]" />
    </div>
  );
}

export function Header() {
  const { openDrawer } = useDrawer();
  const isMounted = useIsMounted();
  let windowScroll = useWindowScroll();
  let [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 z-30 w-full transition-all duration-300 ltr:right-0 rtl:left-0 ltr:xl:pl-72 rtl:xl:pr-72 ltr:2xl:pl-80 rtl:2xl:pr-80 ${
        isMounted && windowScroll.y > 10
          ? 'h-16 bg-gradient-to-b from-white to-white/80 shadow-card backdrop-blur dark:from-dark dark:to-dark/80 sm:h-20'
          : 'h-16 sm:h-24'
      }`}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10 3xl:px-12">
        <div className="flex items-center">
          <div className="block ltr:mr-1 rtl:ml-1 ltr:sm:mr-3 rtl:sm:ml-3 xl:hidden">
            <Hamburger
              isOpen={isOpen}
              onClick={() => openDrawer('DASHBOARD_SIDEBAR')}
              variant="transparent"
              className="dark:text-white"
            />
          </div>
        </div>

        <HeaderRightArea />
      </div>
    </nav>
  );
}

interface DashboardLayoutProps {
  contentClassName?: string;
}

export default function Layout({
  children,
  contentClassName,
}: React.PropsWithChildren<DashboardLayoutProps>) {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Mainnet;

  // You can also provide a custom RPC endpoint.
  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [new LeoWalletAdapter({ appName: 'Leo Demo App' })],
    []
  );

  return (
    <div className="ltr:xl:pl-72 rtl:xl:pr-72 ltr:2xl:pl-80 rtl:2xl:pr-80">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Header />
          <Sidebar className="hidden xl:block" />
          <main
            className={cn(
              'min-h-[100vh] px-4 pt-24 pb-16 sm:px-6 sm:pb-20 lg:px-8 xl:px-10 xl:pb-24 3xl:px-12',
              contentClassName
            )}
          >
            {children}
          </main>
        </WalletModalProvider>
      </WalletProvider>
    </div>
  );
}
