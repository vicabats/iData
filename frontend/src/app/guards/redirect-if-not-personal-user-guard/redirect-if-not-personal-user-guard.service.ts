import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserSessionService } from '../../core/services/user-session/user-session.service';

@Injectable({
  providedIn: 'root',
})
export class RedirectIfNotPersonalUserGuardService implements CanActivate {
  constructor(
    private userSessionService: UserSessionService,
    private router: Router
  ) {}

  public canActivate(): boolean {
    if (
      this.userSessionService.isLoggedIn() &&
      this.userSessionService.getUserType() === 'personal'
    ) {
      return true;
    }

    this.router.navigate(['/my-home']);

    return false;
  }
}
