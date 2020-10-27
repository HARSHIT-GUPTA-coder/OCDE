import { TestBed } from '@angular/core/testing';

import { CodeCompileServiceService } from './code-compile-service.service';

describe('CodeCompileServiceService', () => {
  let service: CodeCompileServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeCompileServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
