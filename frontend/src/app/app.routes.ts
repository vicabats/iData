import { Routes } from '@angular/router';
import { HomePage } from './features/home/pages/home-page/home-page';
import { AboutUsPage } from './features/institutional/about-us-page/about-us-page';
import { SignUpPage } from './features/sign-up/presentation/pages/sign-up-page/sign-up-page';
import { ForgotPasswordPage } from './features/forgot-password/pages/forgot-password-page/forgot-password-page';
import { LoginPage } from './features/login/presentation/pages/login-page/login-page';
import { VerifyCodePage } from './features/verify-code/presentation/pages/verify-code/verify-code-page';
import { VerifyCodeGuardService } from './guards/verify-code-guard.service';
import { UserPage } from './features/user/user-page';
import { LoggedUser } from './features/logged/presentation/pages/logged-user/logged-user';
import { LoggedProfessional } from './features/logged/presentation/pages/logged-professional/logged-professional';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: LoginPage },
  {
    path: 'verify-code',
    component: VerifyCodePage,
    canActivate: [VerifyCodeGuardService],
  },
  { path: 'signup', component: SignUpPage },
  { path: 'user', component: UserPage },
  { path: 'about-us', component: AboutUsPage },
  { path: 'forgot-password', component: ForgotPasswordPage },
  { path: 'logged-user', component: LoggedUser },
  { path: 'logged-professional', component: LoggedProfessional },
];
