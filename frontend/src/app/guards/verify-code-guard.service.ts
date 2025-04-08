import { Injectable } from '@angular/core';
import { AuthFlowGuardService } from '../core/auth/auth-flow-guard.service';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class VerifyCodeGuardService implements CanActivate {
  constructor(
    private authFlowGuardService: AuthFlowGuardService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authFlowGuardService.hasLoginFlowStarted()) {
      return true;
    }

    this.router.navigate(['/login']);

    return false;
  }
}
