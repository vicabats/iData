import { Injectable } from '@angular/core';
import { AuthFlowService } from '../../core/services/auth-flow/auth-flow.service';
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
    private authFlowService: AuthFlowService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authFlowService.hasLoginFlowStarted()) {
      return true;
    }

    this.router.navigate(['/login']);

    return false;
  }
}
