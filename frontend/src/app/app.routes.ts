import { Routes } from '@angular/router';
import { HomePage } from './features/home/pages/home-page/home-page';
import { AboutUsPage } from './features/institutional/about-us-page/about-us-page';
import { ForgotPasswordPage } from './features/forgot-password/pages/forgot-password-page/forgot-password-page';
import { LoginPage } from './features/login/presentation/pages/login-page/login-page';
import { VerifyCodePage } from './features/verify-code/presentation/pages/verify-code/verify-code-page';
import { MedicalRecordsPage } from './features/medical-records/medical-records';
import { ExamsPage } from './features/exams/exams';
import { InProgressPage } from './features/in-progress/in-progress-page';
import { RegisterPage } from './features/register/presentation/pages/register-page/register-page';
import { MyHomePage } from './features/my-home/presentation/pages/my-home-page';
import { RedirectIfLoggedInGuardService } from './guards/redirect-if-logged-in-guard/redirect-if-logged-in-guard.service';
import { MyAccountPage } from './features/my-account/presentation/pages/my-account-page/my-account-page';
import { RedirectIfLoggedOutGuardService } from './guards/redirect-if-logged-out-guard/redirect-if-logged-out-guard.service';
import { DeleteAccountPage } from './features/delete-account/presentation/pages/delete-account-page';
import { CheckIfHasInitializedDeleteAccountGuardService } from './guards/check-if-has-initialized-delete-account/check-if-has-initialized-delete-account-guard.service';
import { CheckIfHasInitializedLoginFlowGuardService } from './guards/check-if-has-initialized-login-flow/check-if-has-initialized-login-flow-guard.service';
import { EditAccountPage } from './features/edit-account/presentation/pages/edit-account-page/edit-account-page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'register', component: RegisterPage },
  {
    path: 'login',
    component: LoginPage,
    canActivate: [RedirectIfLoggedInGuardService],
  },
  {
    path: 'verify-code',
    component: VerifyCodePage,
    canActivate: [CheckIfHasInitializedLoginFlowGuardService],
  },
  {
    path: 'my-home',
    component: MyHomePage,
    canActivate: [RedirectIfLoggedOutGuardService],
  },
  {
    path: 'my-account',
    component: MyAccountPage,
    canActivate: [RedirectIfLoggedOutGuardService],
  },
  {
    path: 'my-account/:userType/delete',
    component: DeleteAccountPage,
    canActivate: [
      RedirectIfLoggedOutGuardService,
      CheckIfHasInitializedDeleteAccountGuardService,
    ],
  },
  {
    path: 'my-account/:userType/edit',
    component: EditAccountPage,
    canActivate: [RedirectIfLoggedOutGuardService],
  },
  { path: 'about-us', component: AboutUsPage },
  {
    path: 'forgot-password',
    component: ForgotPasswordPage,
    canActivate: [RedirectIfLoggedInGuardService],
  },
  { path: 'medical-records', component: MedicalRecordsPage },
  { path: 'exams', component: ExamsPage },
  { path: 'in-progress', component: InProgressPage },
];
