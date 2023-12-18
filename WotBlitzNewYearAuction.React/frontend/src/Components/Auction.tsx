// @flow
import * as React from 'react';
import { useAuction } from './UseAuction';
import { Alert, CircularProgress } from '@mui/material';
import { AuctionItem } from '../Model/AuctionItem';
import { TankCard } from './TankCard';

export function Auction() {
  const { loading, auctionItems, error } = useAuction();

  const sortByAvailableDate = (a: AuctionItem, b: AuctionItem): number => {
    if (a.available_before === b.available_before) {
      return 0;
    }
    return a.available_before > b.available_before ? 1 : -1;
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  } else if (loading) {
    return <CircularProgress />;
  } else {
    return (
      <>
        {auctionItems
          .filter((i) => i.available && i.current_count > 0)
          .sort(sortByAvailableDate)
          .map((auctionItem) => {
            return <TankCard key={auctionItem.entity?.id} vehicle={auctionItem.entity}></TankCard>;
          })}
      </>
    );
  }
}
