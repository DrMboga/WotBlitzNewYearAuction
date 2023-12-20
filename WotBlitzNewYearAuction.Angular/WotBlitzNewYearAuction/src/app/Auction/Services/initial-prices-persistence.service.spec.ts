import { TestBed } from '@angular/core/testing';

import { InitialPricesPersistenceService } from './initial-prices-persistence.service';

describe('InitialPricesPersistenceService', () => {
  let service: InitialPricesPersistenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitialPricesPersistenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
