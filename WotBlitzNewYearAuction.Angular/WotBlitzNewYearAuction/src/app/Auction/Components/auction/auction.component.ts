import { Component, computed, effect, OnDestroy, OnInit, signal, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuctionApiService } from '../../Services/auction-api.service';
import { AsyncPipe, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { TankCardComponent } from '../tank-card/tank-card.component';
import { MatCardModule } from '@angular/material/card';
import { VehicleSortPipe } from '../../Pipes/vehicle-sort.pipe';
import { MatTableModule } from '@angular/material/table';
import { PREMIUM_COLOR } from '../../constants';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { nextPriceDropAsString } from '../../Helpers/time-helper';
import { tap } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const TimerPeriod = 1000; // 1 second
const UpdateAuctionPeriod = 10 * 60 * 1000; // 10 mins in milliseconds

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
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  templateUrl: './auction.component.html',
  styleUrl: './auction.component.css',
})
export class AuctionComponent implements OnInit, OnDestroy {
  public auctionItems$ = this.auctionApi.getAuctionItems();

  public isLoading = this.auctionApi.isLoading;
  public timeToNextDrop = signal<string>('∞');
  public timeUntilRequestInSec = signal<number>(UpdateAuctionPeriod);
  public timeUntilRequestInPercent = computed(() =>
    Math.round((100 * 1000 * this.timeUntilRequestInSec()) / UpdateAuctionPeriod),
  );

  private timer: any;

  constructor(private auctionApi: AuctionApiService) {}

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.onTimerTick();
    }, TimerPeriod);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

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

  private onTimerTick() {
    const now = new Date();
    const currentTimeInMs = now.getTime();
    const timeUntilNewReadData = currentTimeInMs - this.auctionApi.lastReadTime();

    // Check if previous API call finished and also if 10 left after the previous API call
    if (!this.auctionApi.isLoading() && timeUntilNewReadData >= UpdateAuctionPeriod) {
      this.auctionItems$ = this.auctionApi.getAuctionItems().pipe(
        tap((items) => {
          const timerUntilNextPriceDrop = nextPriceDropAsString(
            this.auctionApi.nextPriceDropTime() ?? new Date(Date.UTC(1970, 1, 1, 0, 0, 0)),
          );
          if (timerUntilNextPriceDrop) {
            this.timeToNextDrop.set(timerUntilNextPriceDrop);
          }
        }),
      );
    } else {
      // If 10 minutes did not left, just updating a timer and progress on a page
      const timerUntilNextPriceDrop = nextPriceDropAsString(
        this.auctionApi.nextPriceDropTime() ?? new Date(Date.UTC(1970, 1, 1, 0, 0, 0)),
      );
      if (timerUntilNextPriceDrop) {
        this.timeToNextDrop.set(timerUntilNextPriceDrop);
      }
      this.timeUntilRequestInSec.set(Math.round(timeUntilNewReadData / 1000));
    }
  }
}
