import { TestBed } from '@angular/core/testing';

import { CodestoreService } from './codestore.service';

describe('CodestoreService', () => {
  let service: CodestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
