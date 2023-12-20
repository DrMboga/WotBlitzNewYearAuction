import { Component, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuctionApiService } from '../../Services/auction-api.service';
import { AsyncPipe, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuctionItem } from '../../../Model/AuctionItem';
import { TankCardComponent } from '../tank-card/tank-card.component';
import { MatCardModule } from '@angular/material/card';
import { VehicleSortPipe } from '../../Pipes/vehicle-sort.pipe';
import { MatTableModule } from '@angular/material/table';
import { PREMIUM_COLOR } from '../../constants';

@Component({
  selector: 'app-auction',
  standalone: true,
  imports: [
    MatButtonModule,
    NgIf,
    NgForOf,
    AsyncPipe,
    TankCardComponent,
    MatCardModule,
    VehicleSortPipe,
    MatTableModule,
    DecimalPipe,
  ],
  templateUrl: './auction.component.html',
  styleUrl: './auction.component.css',
})
export class AuctionComponent {
  public auctionItems: Signal<AuctionItem[] | undefined> = toSignal(
    this.auctionApi.getAuctionItems(),
    { initialValue: undefined },
  );
  constructor(private auctionApi: AuctionApiService) {}

  protected readonly PREMIUM_COLOR = PREMIUM_COLOR;

  public priceDrop(currentPrice?: number, initialPrice?: number): string | undefined {
    if (currentPrice === initialPrice || currentPrice === undefined || initialPrice === undefined) {
      return undefined;
    }
    const diff = initialPrice - currentPrice;
    const diffPercent = Math.round(100 * (diff / initialPrice));
    return ` -${diff} (${diffPercent}%)`;
  }

  public availablePercent(current: number, total: number): number {
    return Math.round(100 * (current / total));
  }

  public availableColor(current: number, total: number): string {
    const percent = this.availablePercent(current, total);
    return percent < 10 ? 'red' : 'green';
  }
}
