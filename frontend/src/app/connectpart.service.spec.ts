import { TestBed } from '@angular/core/testing';

import { ConnectpartService } from './connectpart.service';

describe('ConnectpartService', () => {
  let service: ConnectpartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectpartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
