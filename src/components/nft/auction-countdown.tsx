import React from 'react';
import Countdown, { zeroPad } from 'react-countdown';

const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
  if (completed) {
    return null;
  } else {
    return (
      <div className="flex items-center gap-3 text-base font-medium -tracking-wider text-gray-900 dark:text-gray-100 xs:text-lg md:gap-5 md:text-xl xl:text-2xl">
        {!!days && (
          <div className="shrink-0 3xl:w-20">
            {zeroPad(days)}
            <span className="md:hidden">d</span>
            <span className="hidden truncate pt-2.5 text-sm -tracking-wide text-gray-600 dark:text-gray-400 md:block">
              Days
            </span>
          </div>
        )}
        <div className="shrink-0 3xl:w-20">
          {zeroPad(hours)}
          <span className="md:hidden">h</span>
          <span className="hidden truncate pt-2.5 text-sm -tracking-wide text-gray-600 dark:text-gray-400 md:block">
            Hours
          </span>
        </div>
        <div className="shrink-0 3xl:w-20">
          {zeroPad(minutes)}
          <span className="md:hidden">m</span>
          <span className="hidden truncate pt-2.5 text-sm -tracking-wide text-gray-600 dark:text-gray-400 md:block">
            Minutes
          </span>
        </div>
        <div className="shrink-0 3xl:w-20">
          {zeroPad(seconds)}
          <span className="md:hidden">s</span>
          <span className="hidden truncate pt-2.5 text-sm -tracking-wide text-gray-600 dark:text-gray-400 md:block">
            Seconds
          </span>
        </div>
      </div>
    );
  }
};

export default function AuctionCountdown({
  date,
}: {
  date: string | number | Date | undefined;
}) {
  return <Countdown date={date} renderer={renderer} />;
}
