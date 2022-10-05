import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import { useDirection } from '@/lib/hooks/use-direction';
import { useThemeColor } from '@/lib/hooks/use-theme-color';
import { useSettingsDrawer } from '@/components/settings/settings-context';
import { OptionIcon } from '@/components/icons/option';

export default function SettingsButton() {
  const { opeSettings } = useSettingsDrawer();
  const [layout] = useLocalStorage<string>('criptic-layout');
  const [themeColor] = useLocalStorage<string>('criptic-color');

  useDirection(layout ? layout : 'ltr');
  useThemeColor(themeColor ? themeColor : '#323743');

  return (
    <>
      <div className="fixed top-1/2 z-40 -translate-y-1/2 ltr:right-0 rtl:left-0">
        <button
          className="flex h-12 w-12 items-center justify-center bg-white/80 text-gray-600 shadow-large backdrop-blur ltr:rounded-l-lg rtl:rounded-r-lg dark:bg-brand/80 dark:text-gray-200"
          onClick={opeSettings}
          title="Settings"
        >
          <OptionIcon />
          <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-80"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
          </span>
        </button>
      </div>
    </>
  );
}
