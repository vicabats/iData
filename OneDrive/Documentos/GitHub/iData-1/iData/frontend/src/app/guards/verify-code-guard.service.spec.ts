import { TestBed } from '@angular/core/testing';

import { VerifyCodeGuardService } from './verify-code-guard.service';

describe('VerifyCodeGuardService', () => {
  let service: VerifyCodeGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifyCodeGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
