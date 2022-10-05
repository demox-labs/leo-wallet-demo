import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { NextSeo } from 'next-seo';
import type { NextPageWithLayout } from '@/types';
import { useState } from 'react';
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import Button from '@/components/ui/button';
import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import { Copy } from '@/components/icons/copy';
import { Check } from '@/components/icons/check';
import AuthorInformation from '@/components/author/author-information';
import ProfileTab from '@/components/profile/profile-tab';
import Avatar from '@/components/ui/avatar';
// static data
import { authorData } from '@/data/static/author';

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

const AuthorProfilePage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = () => {
  let [copyButtonStatus, setCopyButtonStatus] = useState(false);
  let [_, copyToClipboard] = useCopyToClipboard();
  const handleCopyToClipboard = () => {
    copyToClipboard(authorData.wallet_key);
    setCopyButtonStatus(true);
    setTimeout(() => {
      setCopyButtonStatus(copyButtonStatus);
    }, 2500);
  };
  return (
    <>
      <NextSeo
        title="Profile"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      {/* Profile Cover Image */}
      <div className="relative h-36 w-full overflow-hidden rounded-lg sm:h-44 md:h-64 xl:h-80 2xl:h-96 3xl:h-[448px]">
        <Image
          src={authorData?.cover_image?.thumbnail}
          placeholder="blur"
          layout="fill"
          objectFit="cover"
          alt="Cover Image"
        />
      </div>

      {/* Profile Container */}
      <div className="mx-auto flex w-full shrink-0 flex-col md:px-4 xl:px-6 3xl:max-w-[1700px] 3xl:px-12">
        {/* Profile Image */}
        <Avatar
          size="xl"
          image={authorData?.avatar?.thumbnail}
          alt="Author"
          className="z-10 mx-auto -mt-12 dark:border-gray-500 sm:-mt-14 md:mx-0 md:-mt-16 xl:mx-0 3xl:-mt-20"
        />
        {/* Profile Info */}
        <div className="flex w-full flex-col pt-4 md:flex-row md:pt-10 lg:flex-row xl:pt-12">
          <div className="shrink-0 border-dashed border-gray-200 dark:border-gray-700 md:w-72 ltr:md:border-r md:ltr:pr-7 rtl:md:border-l md:rtl:pl-7 lg:ltr:pr-10 lg:rtl:pl-10 xl:ltr:pr-14 xl:rtl:pl-14 2xl:w-80 3xl:w-96 3xl:ltr:pr-16 3xl:rtl:pl-16">
            <div className="text-center ltr:md:text-left rtl:md:text-right">
              {/* Name */}
              <h2 className="text-xl font-medium tracking-tighter text-gray-900 dark:text-white xl:text-2xl">
                {authorData?.name}
              </h2>

              {/* Username */}
              <div className="mt-1 text-sm font-medium tracking-tighter text-gray-600 dark:text-gray-400 xl:mt-3">
                @{authorData?.user_name}
              </div>

              {/* User ID and Address */}
              <div className="mt-5 inline-flex h-9 items-center rounded-full bg-white shadow-card dark:bg-light-dark xl:mt-6">
                <div className="inline-flex h-full shrink-0 grow-0 items-center rounded-full bg-gray-900 px-4 text-xs text-white sm:text-sm">
                  #{authorData?.id}
                </div>
                <div className="text w-28 grow-0 truncate text-ellipsis bg-center text-xs text-gray-500 ltr:pl-4 rtl:pr-4 dark:text-gray-300 sm:w-32 sm:text-sm">
                  {authorData?.wallet_key}
                </div>
                <div
                  className="flex cursor-pointer items-center px-4 text-gray-500 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  title="Copy Address"
                  onClick={handleCopyToClipboard}
                >
                  {copyButtonStatus ? (
                    <Check className="h-auto w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-auto w-3.5" />
                  )}
                </div>
              </div>
            </div>

            {/* Followers, Following and follow button */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 border-y border-dashed border-gray-200 py-5 text-center dark:border-gray-700 md:justify-start ltr:md:text-left rtl:md:text-right xl:mt-12 xl:gap-8 xl:py-6">
              <div>
                <div className="mb-1.5 text-lg font-medium tracking-tighter text-gray-900 dark:text-white">
                  {authorData?.following}
                </div>
                <div className="text-sm tracking-tighter text-gray-600 dark:text-gray-400">
                  Following
                </div>
              </div>

              <div>
                <div className="mb-1.5 text-lg font-medium tracking-tighter text-gray-900 dark:text-white">
                  {authorData?.followers}
                </div>
                <div className="text-sm tracking-tighter text-gray-600 dark:text-gray-400">
                  Followers
                </div>
              </div>

              <Button
                color="white"
                className="shadow-card dark:bg-light-dark md:h-10 md:px-5 xl:h-12 xl:px-7"
              >
                Follow
              </Button>
            </div>

            {/* Followed by */}
            <div className="border-y border-dashed border-gray-200 py-5 text-center dark:border-gray-700 ltr:md:text-left rtl:md:text-right xl:py-6">
              <div className="mb-2 text-sm font-medium uppercase tracking-wider text-gray-900 dark:text-white">
                Followed by
              </div>
              <div className="flex justify-center md:justify-start">
                {/* Followers list */}
                {authorData?.followed_by?.map((item) => (
                  <AnchorLink
                    key={item?.id}
                    href="/"
                    className="-ml-2 first:ml-0"
                  >
                    <Avatar
                      size="sm"
                      image={item?.avatar?.thumbnail}
                      alt="Author"
                      height={28}
                      width={28}
                      className="dark:border-gray-500"
                    />
                  </AnchorLink>
                ))}
              </div>

              <div className="mt-4">
                <AnchorLink
                  href="/"
                  className="text-sm tracking-tighter text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  View All
                </AnchorLink>
              </div>
            </div>

            <AuthorInformation className="hidden md:block" data={authorData} />
          </div>

          <div className="grow pt-6 pb-9 md:-mt-2.5 md:pt-1.5 md:pb-0 md:ltr:pl-7 md:rtl:pr-7 lg:ltr:pl-10 lg:rtl:pr-10 xl:ltr:pl-14 xl:rtl:pr-14 3xl:ltr:pl-16 3xl:rtl:pr-16">
            <ProfileTab />
          </div>
          <AuthorInformation data={authorData} />
        </div>
      </div>
    </>
  );
};

AuthorProfilePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default AuthorProfilePage;
