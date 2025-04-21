import { TestBed } from '@angular/core/testing';

import { RedirectIfLoggedInGuardService } from './redirect-if-logged-in-guard.service';

describe('RedirectIfLoggedInGuardService', () => {
  let service: RedirectIfLoggedInGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RedirectIfLoggedInGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
