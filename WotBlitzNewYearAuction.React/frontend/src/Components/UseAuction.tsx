// @flow
import * as React from 'react';
import { useEffect, useState } from 'react';
import { auctionAPI } from '../api/AuctionApi';
import { AuctionItem } from '../Model/AuctionItem';
import { InitialPrices } from '../Model/InitialPrices';

const LocalStorageKey = 'initial-prices';

export function useAuction() {
  const [loading, setLoading] = React.useState(false);
  const [auctionItems, setAuctionItems] = React.useState<AuctionItem[]>([]);
  const [error, setError] = React.useState(null);

  const [initialPrices, setInitialPrices] = useState<InitialPrices[]>(
    JSON.parse(localStorage.getItem(LocalStorageKey) ?? '[]') ?? [],
  );

  useEffect(() => {
    localStorage.setItem(LocalStorageKey, JSON.stringify(initialPrices));
  }, [initialPrices]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    auctionAPI
      .get()
      .then((data) => {
        if (data?.results) {
          const initialPricesCopy = [...initialPrices];
          for (const auctionItem of data.results.filter(
            (i) => i.available && i.current_count > 0,
          )) {
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
          }
          setInitialPrices(initialPricesCopy);
        }

        setAuctionItems(data?.results ?? []);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return { loading, auctionItems, error };
}
