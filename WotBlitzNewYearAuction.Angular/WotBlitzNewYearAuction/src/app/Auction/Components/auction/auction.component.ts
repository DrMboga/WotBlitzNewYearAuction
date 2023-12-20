import { Component, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuctionApiService } from '../../Services/auction-api.service';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuctionItem } from '../../../Model/AuctionItem';
import { TankCardComponent } from '../tank-card/tank-card.component';

@Component({
  selector: 'app-auction',
  standalone: true,
  imports: [MatButtonModule, NgIf, NgForOf, AsyncPipe, TankCardComponent],
  templateUrl: './auction.component.html',
  styleUrl: './auction.component.css',
})
export class AuctionComponent {
  public auctionItems: Signal<AuctionItem[] | undefined> = toSignal(
    this.auctionApi.getAuctionItems(),
    { initialValue: undefined },
  );
  constructor(private auctionApi: AuctionApiService) {}
}
