import { Routes } from '@angular/router';
import { HomePage } from './features/home/pages/home-page/home-page';
import { LoginPage } from './features/login/pages/login-page/login-page';
import { AboutUsPage } from './features/institutional/about-us-page/about-us-page';
import { SignUpPage } from './features/sign-up/pages/sign-up-page/sign-up-page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: LoginPage },
  { path: 'signup', component: SignUpPage },
  { path: 'about-us', component: AboutUsPage },
];
