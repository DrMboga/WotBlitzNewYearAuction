import { TestBed } from '@angular/core/testing';

import { AuctionApiService } from './auction-api.service';

describe('AuctionApiService', () => {
  let service: AuctionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuctionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
