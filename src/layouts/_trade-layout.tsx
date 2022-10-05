import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import cn from 'classnames';
import routes from '@/config/routes';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import Button from '@/components/ui/button';
import ActiveLink from '@/components/ui/links/active-link';
import AnchorLink from '@/components/ui/links/anchor-link';
import { RangeIcon } from '@/components/icons/range-icon';
import { ExportIcon } from '@/components/icons/export-icon';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
// dynamic import
const Listbox = dynamic(() => import('@/components/ui/list-box'));

const tradeMenu = [
  {
    name: 'Swap',
    value: routes.swap,
  },
  {
    name: 'Liquidity',
    value: routes.liquidity,
  },
  {
    name: 'Vote',
    value: routes.vote,
  },
];

function ActiveNavLink({ href, title, isActive, className }: any) {
  return (
    <ActiveLink
      href={href}
      className={cn(
        'relative z-[1] inline-flex items-center py-1.5 px-3',
        className
      )}
      activeClassName="font-medium text-white"
    >
      <span>{title}</span>
      {isActive && (
        <motion.span
          className="absolute left-0 right-0 bottom-0 -z-[1] h-full w-full rounded-lg bg-brand shadow-large"
          layoutId="activeNavLinkIndicator"
        />
      )}
    </ActiveLink>
  );
}

export default function TradeLayout({ children }: React.PropsWithChildren<{}>) {
  const router = useRouter();
  const isMounted = useIsMounted();
  const breakpoint = useBreakpoint();
  const currentPath = tradeMenu.findIndex(
    (item) => item.value === router.pathname
  );
  let [selectedMenuItem, setSelectedMenuItem] = useState(tradeMenu[0]);
  function handleRouteOnSelect(path: string) {
    router.push(path);
  }
  useEffect(() => {
    setSelectedMenuItem(tradeMenu[currentPath]);
  }, [currentPath]);
  return <DashboardLayout></DashboardLayout>;
}
