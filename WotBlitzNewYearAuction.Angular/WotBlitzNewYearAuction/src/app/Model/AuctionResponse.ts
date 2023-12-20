import { AuctionItem } from './AuctionItem';

export interface AuctionResponse {
  count: number;
  results: AuctionItem[];
}
