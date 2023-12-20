import { Component, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuctionApiService } from '../../Services/auction-api.service';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuctionItem } from '../../../Model/AuctionItem';

@Component({
  selector: 'app-auction',
  standalone: true,
  imports: [MatButtonModule, NgIf, NgForOf, AsyncPipe],
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
