import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useIsDarkMode } from '@/lib/hooks/use-is-dark-mode';
import lightLogo from '@/assets/images/logo.svg';
import darkLogo from '@/assets/images/logo-white.svg';
import logo from '@/assets/images/icon.svg';

const Logo: React.FC<React.SVGAttributes<{}>> = (props) => {
  const isMounted = useIsMounted();
  const { isDarkMode } = useIsDarkMode();

  return (
    <AnchorLink
      href="https://leo.app"
      className="w-128 sm:w-150 4xl:w-165 flex py-4 outline-none"
      {...props}
    >
      <span className="relative flex overflow-hidden">
        {isMounted && isDarkMode && (
          <Image src={logo} alt="Leo Wallet" priority />
        )}
        {isMounted && !isDarkMode && (
          <Image src={logo} alt="Leo Wallet" priority />
        )}
      </span>
    </AnchorLink>
  );
};

export default Logo;
