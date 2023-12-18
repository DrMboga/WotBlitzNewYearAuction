// @flow
import * as React from 'react';
import { useEffect } from 'react';
import { auctionAPI } from '../api/AuctionApi';
import { AuctionItem } from '../Model/AuctionItem';

export function useAuction() {
  const [loading, setLoading] = React.useState(false);
  const [auctionItems, setAuctionItems] = React.useState<AuctionItem[]>([]);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    auctionAPI
      .get()
      .then((data) => {
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
