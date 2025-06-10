import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserSessionService } from '../../core/services/user-session/user-session.service';

@Injectable({
  providedIn: 'root',
})
export class RedirectIfNotProfessionalUserGuardService implements CanActivate {
  constructor(
    private userSessionService: UserSessionService,
    private router: Router
  ) {}

  public canActivate(): boolean {
    if (
      this.userSessionService.isLoggedIn() &&
      this.userSessionService.getUserType() === 'professional'
    ) {
      return true;
    }

    this.router.navigate(['/my-home']);

    return false;
  }
}
