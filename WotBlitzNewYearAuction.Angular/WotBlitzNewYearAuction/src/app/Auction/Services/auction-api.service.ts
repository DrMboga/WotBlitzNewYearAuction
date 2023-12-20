import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuctionResponse } from '../../Model/AuctionResponse';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuctionItem } from '../../Model/AuctionItem';
import { InitialPricesPersistenceService } from './initial-prices-persistence.service';

const AuctionUrl = 'http://localhost:6001/auction';

const sortByAvailableDate = (a: AuctionItem, b: AuctionItem): number => {
  if (a.available_before === b.available_before) {
    return 0;
  }
  return a.available_before > b.available_before ? 1 : -1;
};

@Injectable({
  providedIn: 'root',
})
export class AuctionApiService {
  constructor(
    private http: HttpClient,
    private initialPricesPersistence: InitialPricesPersistenceService,
  ) {}

  public getAuctionItems(): Observable<AuctionItem[] | undefined> {
    const initialPrices = this.initialPricesPersistence.getInitialPrices();
    return this.http.get<AuctionResponse>(AuctionUrl).pipe(
      map((response) => {
        if (!response?.results) {
          return undefined;
        }
        for (const auctionItem of response.results.filter(
          (i) => i.available && i.current_count > 0,
        )) {
          const initialPrice = initialPrices.find((i) => i.vehicleId === auctionItem.entity!.id);
          if (initialPrice) {
            auctionItem.initialPrice = initialPrice.initialPrice;
          } else {
            auctionItem.initialPrice = auctionItem.price!.value;
            this.initialPricesPersistence.addNewInitialPrice({
              vehicleId: auctionItem.entity!.id,
              initialPrice: auctionItem.price!.value,
            });
          }

          if (auctionItem.next_price_datetime) {
            // TODO: Push next price to variable
          }
        }

        const now = new Date();
        // TODO: Set this date to lastApiReadTime

        return response.results
          .filter((i) => i.available && i.current_count > 0)
          .sort(sortByAvailableDate);
      }),
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
