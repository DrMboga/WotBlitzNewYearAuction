import { Injectable } from '@angular/core';
import { InitialPrices } from '../../Model/InitialPrices';

const LocalStorageKey = 'initial-prices';

@Injectable({
  providedIn: 'root',
})
export class InitialPricesPersistenceService {
  public getInitialPrices(): InitialPrices[] {
    return JSON.parse(localStorage.getItem(LocalStorageKey) ?? '[]') ?? [];
  }

  public addNewInitialPrice(initialPrice: InitialPrices): void {
    const initialPrices = this.getInitialPrices();
    const existingInitialPrice = initialPrices.find((p) => p.vehicleId === initialPrice.vehicleId);
    if (existingInitialPrice) {
      existingInitialPrice.initialPrice = initialPrice.initialPrice;
    } else {
      initialPrices.push(initialPrice);
    }

    localStorage.setItem(LocalStorageKey, JSON.stringify(initialPrices));
  }
}
