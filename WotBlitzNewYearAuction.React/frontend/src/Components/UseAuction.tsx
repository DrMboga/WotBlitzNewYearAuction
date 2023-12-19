// @flow
import * as React from 'react';
import { useEffect, useState } from 'react';
import { auctionAPI } from '../api/AuctionApi';
import { AuctionItem } from '../Model/AuctionItem';
import { InitialPrices } from '../Model/InitialPrices';
import { getUtcNow } from '../helpers';

const LocalStorageKey = 'initial-prices';
const TimerPeriod = 1000; // 1 second
export const UpdateAuctionPeriod = 10 * 60 * 1000; // 10 mins in milliseconds
const MinDateTime = 2674800000; // 01.01.1970 in ms

export function useAuction() {
  const [loading, setLoading] = React.useState(false);
  const [auctionItems, setAuctionItems] = React.useState<AuctionItem[]>([]);
  const [error, setError] = React.useState<string | undefined>(undefined);

  // Reads serialized InitialPrices from local storage
  const [initialPrices, setInitialPrices] = useState<InitialPrices[]>(
    JSON.parse(localStorage.getItem(LocalStorageKey) ?? '[]') ?? [],
  );
  // Stores a new serialized initial values in local storage.
  useEffect(() => {
    localStorage.setItem(LocalStorageKey, JSON.stringify(initialPrices));
  }, [initialPrices]);

  // NOTE: It is easy to mix upp with this state variables. Short introduction:
  // - We have the DatTime when auction prices dropped. `nextPriceDropTime` This value comes from API response
  // - We have a countdown timer `timeToNextDrop` - how much time left until the next auction prices drop. This countdown is shown on a component
  // - We have a 10 minutes period between API calls. `UpdateAuctionPeriod` Each 10 minutes, a new data From API is showing on the form
  // - We have a datetime when API called last time `lastReadTime`. Since this datetime timer calculates if 10 mins are passed or not
  // - We have a counter `timeUntilRequestInSec` - this stores information how many seconds passed since last API call. This value is shown on a component in the progress bar
  // - And finally. We have a `currentTimeInMs` - this is a timestamp of each second.
  //    - We have an initial hook when timer started. Each tick timer updates the `currentTimeInMs`
  //    - We have a hook which listens the `currentTimeInMs` and other state variables. This hook makes the general logic:
  //      - updates countdown timer and progress bar variable
  //      - calculates how much time left since last API call and if 10 minutes are passed, than makes another API call

  // This is needed for timer tick hook
  const [currentTimeInMs, setCurrentTimeInMs] = useState<number>(MinDateTime); // 01.01.1970 in ms

  // This is a date of dropping prices. It comes from API and updates each API call
  const [nextPriceDropTime, setNextPriceDropTime] = useState<Date>(
    new Date(Date.UTC(1970, 1, 1, 0, 0, 0)),
  );
  // This is a string representation of countdown timer in a component - how much time left until next time drop
  const [timeToNextDrop, setTimeToNextDrop] = useState<string>('');

  // This is the time of last API call, timer checks this value each tick, if we need to make another call
  const [lastReadTime, setLastReadTime] = useState<number>(MinDateTime); // 01.01.1970 in ms
  // This is needed to count time until next API call. Used in a progress bar on a component
  const [timeUntilRequestInSec, setTimeUntilRequestInSec] = useState<number>(UpdateAuctionPeriod);

  const nextPriceDropAsString = (dateUntil: Date): string => {
    const utcNow = getUtcNow();
    const dateUntilAsDate = new Date(dateUntil);
    const timeDiffInSec = Math.round(Math.abs(utcNow.getTime() - dateUntilAsDate.getTime()) / 1000);
    const dayInSec = 60 * 60 * 24;
    if (timeDiffInSec > dayInSec) {
      return '∞';
    }

    const hours = Math.floor(timeDiffInSec / (60 * 60));
    const minutes = Math.floor((timeDiffInSec - hours * 60 * 60) / 60);
    const seconds = Math.round(timeDiffInSec - hours * 60 * 60 - minutes * 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const readAuctionData = async (initialPricesToLook: InitialPrices[]) => {
    setLoading(true);
    setError(undefined);
    try {
      const data = await auctionAPI.get();
      if (data?.results) {
        const initialPricesCopy = [...initialPricesToLook];
        let currentNextPriceDropTime: Date | undefined = undefined;
        for (const auctionItem of data.results.filter((i) => i.available && i.current_count > 0)) {
          const initialPrice = initialPricesCopy.find(
            (i) => i.vehicleId === auctionItem.entity!.id,
          );
          if (initialPrice) {
            auctionItem.initialPrice = initialPrice.initialPrice;
          } else {
            auctionItem.initialPrice = auctionItem.price!.value;
            initialPricesCopy.push({
              vehicleId: auctionItem.entity!.id,
              initialPrice: auctionItem.price!.value,
            });
          }

          if (auctionItem.next_price_datetime) {
            currentNextPriceDropTime = auctionItem.next_price_datetime;
          }
        }
        if (currentNextPriceDropTime) {
          setNextPriceDropTime(currentNextPriceDropTime);
        }
        setInitialPrices(initialPricesCopy);
      }

      setAuctionItems(data?.results ?? []);
      const now = new Date();
      setLastReadTime(now.getTime());
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      setLoading(false);
    }
  };

  // On component initialized. Timer started and updates current time value each tick
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTimeInMs(now.getTime());
    }, TimerPeriod);

    return () => clearInterval(interval);
  }, []);

  // Effect fired on each timer tick because `currentTimeInMs` updated by timer. Also, it listens the other state value changes
  useEffect(() => {
    const timeUntilNewReadData = currentTimeInMs - lastReadTime;

    // Check if previous API call finished and also if 10 left after the previous API call
    if (!loading && timeUntilNewReadData >= UpdateAuctionPeriod) {
      readAuctionData(initialPrices).then(() => {
        const timerUntilNextPriceDrop = nextPriceDropAsString(nextPriceDropTime);
        if (timerUntilNextPriceDrop) {
          setTimeToNextDrop(timerUntilNextPriceDrop);
        }
      });
    } else {
      // If 10 minutes did not left, just updating a timer and progress on a page
      const timerUntilNextPriceDrop = nextPriceDropAsString(nextPriceDropTime);
      if (timerUntilNextPriceDrop) {
        setTimeToNextDrop(timerUntilNextPriceDrop);
      }
      setTimeUntilRequestInSec(Math.round(timeUntilNewReadData / 1000));
    }
  }, [loading, currentTimeInMs, lastReadTime, nextPriceDropTime, initialPrices]);

  return { loading, auctionItems, error, timeToNextDrop, timeUntilRequestInSec };
}
