import { TestBed } from '@angular/core/testing';

import { StatementsfetchserviceService } from './statementsfetchservice.service';

describe('StatementsfetchserviceService', () => {
  let service: StatementsfetchserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatementsfetchserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
