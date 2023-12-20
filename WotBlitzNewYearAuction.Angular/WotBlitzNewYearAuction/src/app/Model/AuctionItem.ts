import { ItemPrice } from './ItemPrice';
import { Vehicle } from './Vehicle';

export interface AuctionItem {
  available: boolean;
  entity?: Vehicle;
  initial_count: number;
  current_count: number;
  available_from: Date;
  available_before: Date;
  next_price_datetime?: Date;
  price?: ItemPrice;
  next_price?: ItemPrice;
  initialPrice?: number;
}
