import { Routes } from '@angular/router';
import { HomePage } from './features/home/pages/home-page/home-page';
import { LoginPage } from './features/login/pages/login-page/login-page';
import { AboutUsPage } from './features/institutional/about-us-page/about-us-page';
import { SignUpPage } from './features/sign-up/presentation/pages/sign-up-page/sign-up-page';
import { ForgotPasswordPage } from './features/forgot-password/pages/forgot-password-page/forgot-password-page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: LoginPage },
  { path: 'signup', component: SignUpPage },
  { path: 'about-us', component: AboutUsPage },
  { path: 'forgot-password', component: ForgotPasswordPage },
];
