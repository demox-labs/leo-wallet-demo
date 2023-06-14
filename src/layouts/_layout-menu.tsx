import { Fragment } from 'react';
import Logo from '@/components/ui/logo';
import Button from '@/components/ui/button';
import { Menu } from '@/components/ui/menu';
import { Transition } from '@/components/ui/transition';
import ActiveLink from '@/components/ui/links/active-link';
import Scrollbar from '@/components/ui/scrollbar';
import { ChevronForward } from '@/components/icons/chevron-forward';
import { Close } from '@/components/icons/close';
import { useDrawer } from '@/components/drawer-views/context';
import { ChevronDown } from '@/components/icons/chevron-down';

const MenuLinks = [
  {
    name: 'Home',
    dropDownItems: [
      { name: 'Modern', href: '/' },
      { name: 'Minimal', href: '/minimal' },
    ],
  },
  { name: 'Sign', href: '/sign' },
  { name: 'Decrypt', href: '/decrypt' },
  { name: 'Records', href: '/records' },
  { name: 'Execute', href: '/execute' },
  { name: 'Deploy', href: '/deploy' },
];

export function MenuItems() {
  return (
    <div className="flex items-center xl:px-10 2xl:px-14 3xl:px-16">
      {MenuLinks.map((item, index) => (
        <>
          {item.dropDownItems ? (
            <div className="relative mx-4 first:ml-0 last:mr-0" key={index}>
              <Menu>
                <Menu.Button className="flex items-center text-sm font-medium uppercase text-gray-600 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  {item.name}

                  <span className="z-[1] transition-transform duration-200 ltr:ml-3 rtl:mr-3">
                    <ChevronDown />
                  </span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4"
                  enterTo="opacity-100 translate-y-0"
                  leave="ease-in duration-300"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-4"
                >
                  <Menu.Items className="absolute left-0 mt-5 w-64 origin-top-right rounded-lg bg-white p-3 shadow-large dark:bg-gray-800">
                    {item.dropDownItems.map((dropDownItem, index) => (
                      <Menu.Item key={index}>
                        <ActiveLink
                          href={dropDownItem.href}
                          className="block rounded-lg px-3 py-2 text-sm font-medium uppercase text-gray-900 transition hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700"
                          activeClassName="!bg-gray-100 dark:!bg-light-dark my-1 last:mb-0 first:mt-0"
                        >
                          {dropDownItem.name}
                        </ActiveLink>
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          ) : (
            <ActiveLink
              key={index}
              href={item.href}
              className="mx-4 text-sm font-medium uppercase text-gray-600 transition first:ml-0 last:mr-0 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              activeClassName="text-gray-900"
            >
              {item.name}
            </ActiveLink>
          )}
        </>
      ))}
    </div>
  );
}

export default function DrawerMenu() {
  const { closeDrawer } = useDrawer();
  return (
    <div className="relative w-full max-w-full bg-white dark:bg-dark xs:w-80">
      <div className="flex h-24 items-center justify-between overflow-hidden px-6 py-4">
        <Logo />
        <div className="md:hidden">
          <Button
            title="Close"
            color="white"
            shape="circle"
            variant="transparent"
            size="small"
            onClick={closeDrawer}
          >
            <Close className="h-auto w-2.5" />
          </Button>
        </div>
      </div>

      <Scrollbar style={{ height: 'calc(100% - 96px)' }}>
        <div className="flex flex-col px-6 pb-16 sm:pb-20">
          <Menu>
            {({ open }) => (
              <>
                <Menu.Button className="flex items-center justify-between border-t border-dashed py-3.5 text-justify text-sm font-medium uppercase text-gray-900 transition first:border-t-0 hover:text-gray-900 dark:text-white dark:hover:text-white">
                  Explore
                  <ChevronForward
                    className={`ml-3 transition-transform ${
                      open ? 'rotate-90' : ''
                    }`}
                  />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="ease-in-out duration-200"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Menu.Items className="">
                    <Menu.Item>
                      <ActiveLink
                        href="/"
                        className="mb-3.5 flex items-center text-sm font-normal uppercase text-gray-600 before:mr-3.5 before:block before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-gray-600 dark:text-gray-400 dark:before:bg-gray-400 dark:hover:text-white"
                        activeClassName="!text-gray-900 dark:!text-white dark:before:!bg-white before:!bg-gray-900 before:scale-125"
                      >
                        Collection
                      </ActiveLink>
                    </Menu.Item>
                    <Menu.Item>
                      <ActiveLink
                        href="/profile"
                        className="mb-3.5 flex items-center text-sm font-normal uppercase text-gray-600 before:mr-3.5 before:block before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-gray-600 dark:text-gray-400 dark:before:bg-gray-400 dark:hover:text-white"
                        activeClassName="!text-gray-900 dark:!text-white dark:before:!bg-white before:!bg-gray-900 before:scale-125"
                      >
                        Trending
                      </ActiveLink>
                    </Menu.Item>
                    <Menu.Item>
                      <ActiveLink
                        href="/"
                        className="mb-3.5 flex items-center text-sm font-normal uppercase text-gray-600 before:mr-3.5 before:block before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-gray-600 dark:text-gray-400 dark:before:bg-gray-400 dark:hover:text-white"
                        activeClassName="!text-gray-900 dark:!text-white dark:before:!bg-white before:!bg-gray-900 before:scale-125"
                      >
                        Browse
                      </ActiveLink>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>

          <ActiveLink
            href="/"
            className="border-t border-dashed py-3.5 text-sm font-medium uppercase text-gray-900 transition first:border-t-0 hover:text-gray-900 dark:border-gray-700 dark:text-white"
            activeClassName="text-gray-900 dark:text-white"
          >
            Feed
          </ActiveLink>
          <ActiveLink
            href="/"
            className="border-t border-dashed py-3.5 text-sm font-medium uppercase text-gray-900 transition first:border-t-0 hover:text-gray-900 dark:border-gray-700 dark:text-white"
            activeClassName="text-gray-900 dark:text-white"
          >
            Activity
          </ActiveLink>

          <Menu>
            {({ open }) => (
              <>
                <Menu.Button className="flex items-center justify-between border-t border-dashed py-3.5 text-justify text-sm font-medium uppercase text-gray-900 transition first:border-t-0 hover:text-gray-900 dark:border-gray-700 dark:text-white dark:hover:text-white">
                  Account
                  <ChevronForward
                    className={`ml-3 transition-transform ${
                      open ? 'rotate-90' : ''
                    }`}
                  />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="ease-in-out duration-200"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Menu.Items className="">
                    <Menu.Item>
                      <ActiveLink
                        href="/"
                        className="mb-3.5 flex items-center text-sm font-normal uppercase text-gray-600 before:mr-3.5 before:block before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-gray-600 dark:text-gray-400 dark:before:bg-gray-400 dark:hover:text-white"
                        activeClassName="!text-gray-900 dark:!text-white dark:before:!bg-white before:!bg-gray-900 before:scale-125"
                      >
                        View profile
                      </ActiveLink>
                    </Menu.Item>
                    <Menu.Item>
                      <ActiveLink
                        href="/"
                        className="mb-3.5 flex items-center text-sm font-normal uppercase text-gray-600 before:mr-3.5 before:block before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-gray-600 dark:text-gray-400 dark:before:bg-gray-400 dark:hover:text-white"
                        activeClassName="!text-gray-900 dark:!text-white dark:before:!bg-white before:!bg-gray-900 before:scale-125"
                      >
                        settings
                      </ActiveLink>
                    </Menu.Item>
                    <Menu.Item>
                      <ActiveLink
                        href="/"
                        className="mb-3.5 flex items-center text-sm font-normal uppercase text-gray-600 before:mr-3.5 before:block before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-gray-600 dark:text-gray-400 dark:before:bg-gray-400 dark:hover:text-white"
                        activeClassName="!text-gray-900 dark:!text-white dark:before:!bg-white before:!bg-gray-900 before:scale-125"
                      >
                        help
                      </ActiveLink>
                    </Menu.Item>
                    <Menu.Item>
                      <ActiveLink
                        href="/"
                        className="mb-3.5 flex items-center text-sm font-normal uppercase text-gray-600 before:mr-3.5 before:block before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-gray-600 dark:text-gray-400 dark:before:bg-gray-400 dark:hover:text-white"
                        activeClassName="!text-gray-900 dark:!text-white dark:before:!bg-white before:!bg-gray-900 before:scale-125"
                      >
                        Disconnect
                      </ActiveLink>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>

          <ActiveLink
            href="/"
            className="border-t border-dashed py-3.5 text-sm font-medium uppercase text-gray-900 transition first:border-t-0 hover:text-gray-900 dark:border-gray-700 dark:text-white"
            activeClassName="text-gray-900 dark:text-white"
          >
            Notification
          </ActiveLink>
        </div>
      </Scrollbar>

      <div className="absolute left-0 bottom-4 z-10 w-full  px-6">
        <Button fullWidth>Connect</Button>
      </div>
    </div>
  );
}
