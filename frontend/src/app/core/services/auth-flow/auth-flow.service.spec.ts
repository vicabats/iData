import { TestBed } from '@angular/core/testing';

import { AuthFlowGuardService } from './auth-flow.service';

describe('AuthFlowGuardService', () => {
  let service: AuthFlowGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthFlowGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
