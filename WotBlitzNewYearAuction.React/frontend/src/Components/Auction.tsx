// @flow
import * as React from 'react';
import { useAuction } from './UseAuction';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { AuctionItem } from '../Model/AuctionItem';
import { CollectibleColor, PremiumColor, TankCard } from './TankCard';

export function Auction() {
  const { loading, auctionItems, error } = useAuction();

  const sortByAvailableDate = (a: AuctionItem, b: AuctionItem): number => {
    if (a.available_before === b.available_before) {
      return 0;
    }
    return a.available_before > b.available_before ? 1 : -1;
  };

  const nameColor = (isPremium: boolean, isCollectible: boolean): string => {
    if (!isPremium && !isCollectible) {
      return 'text.secondary';
    }
    return isCollectible ? CollectibleColor : PremiumColor;
  };

  const priceDrop = (currentPrice?: number, initialPrice?: number): string | undefined => {
    if (currentPrice === initialPrice || currentPrice === undefined || initialPrice === undefined) {
      return undefined;
    }
    const diff = initialPrice - currentPrice;
    const diffPercent = Math.round(100 * (diff / initialPrice));
    return ` -${diff} (${diffPercent}%)`;
  };

  const availablePercent = (current: number, total: number): number => {
    return Math.round(100 * (current / total));
  };

  const availableColor = (current: number, total: number): string => {
    const percent = availablePercent(current, total);
    return percent < 10 ? 'red' : 'green';
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  } else if (loading) {
    return <CircularProgress />;
  } else {
    return (
      <Box display="flex" flexDirection="row" flexWrap="wrap" gap="5px">
        {auctionItems
          .filter((i) => i.available && i.current_count > 0)
          .sort(sortByAvailableDate)
          .map((auctionItem) => {
            return (
              <Card
                sx={{ maxWidth: '18rem', width: '18rem' }}
                key={`card-${auctionItem.entity!.id}`}
              >
                <CardContent>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <TankCard
                      key={`tank-card-${auctionItem.entity!.id}`}
                      vehicle={auctionItem.entity}
                    ></TankCard>
                    <Typography
                      variant="h6"
                      component="div"
                      color={nameColor(
                        auctionItem.entity!.is_premium,
                        auctionItem.entity!.is_collectible,
                      )}
                    >
                      {auctionItem.entity!.user_string}
                    </Typography>
                  </Box>
                  <TableContainer component={Paper} sx={{ width: '100%' }}>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Current Price
                        </TableCell>
                        <TableCell align="right">
                          <span style={{ color: PremiumColor }}>{auctionItem.price?.value}</span>
                          {priceDrop(auctionItem.price?.value, auctionItem.initialPrice)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Available
                        </TableCell>
                        <TableCell align="right">
                          <span
                            style={{
                              color: availableColor(
                                auctionItem.current_count,
                                auctionItem.initial_count,
                              ),
                            }}
                          >
                            {auctionItem.current_count}
                          </span>
                          / {auctionItem.initial_count} (
                          {availablePercent(auctionItem.current_count, auctionItem.initial_count)}
                          )%)
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Available until
                        </TableCell>
                        <TableCell align="right">
                          {new Date(auctionItem.available_before).toLocaleDateString('de-DE')}
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ border: 0 }}>
                        <TableCell component="th" scope="row" sx={{ border: 0 }}>
                          Next price
                        </TableCell>
                        <TableCell align="right" sx={{ border: 0 }}>
                          <span style={{ color: PremiumColor }}>
                            {auctionItem.next_price?.value}
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </TableContainer>
                </CardContent>
              </Card>
            );
          })}
      </Box>
    );
  }
}
