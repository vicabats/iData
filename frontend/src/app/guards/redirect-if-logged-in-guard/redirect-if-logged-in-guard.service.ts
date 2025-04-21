import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserSessionService } from '../../core/services/user-session/user-session.service';

@Injectable({
  providedIn: 'root',
})
export class RedirectIfLoggedInGuardService implements CanActivate {
  constructor(
    private userSessionService: UserSessionService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.userSessionService.isLoggedIn()) {
      this.router.navigate(['/profile']);
      return false;
    }
    return true;
  }
}
