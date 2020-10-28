import { TestBed } from '@angular/core/testing';

import { CodefetchService } from './codefetch.service';

describe('CodefetchService', () => {
  let service: CodefetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodefetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
