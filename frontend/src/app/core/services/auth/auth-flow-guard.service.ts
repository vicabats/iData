import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthFlowGuardService {
  private hasStartedLoginFlow = false;

  constructor() {}

  setLoginFlowStarted(value: boolean) {
    this.hasStartedLoginFlow = value;
  }

  hasLoginFlowStarted(): boolean {
    return this.hasStartedLoginFlow;
  }

  clearLoginFlow(): void {
    this.hasStartedLoginFlow = false;
  }
}
