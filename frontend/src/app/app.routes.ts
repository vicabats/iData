import { Routes } from '@angular/router';
import { HomePage } from './features/home/pages/home-page/home-page';
import { LoginPage } from './features/login/pages/login-page/login-page';
import { SiginPage } from './features/signin/pages/sigin-page/sigin-page';
import { AboutUsPage } from './features/institutional/about-us-page/about-us-page';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'login', component: LoginPage },
    { path: 'signin', component: SiginPage },
    { path: 'about-us', component: AboutUsPage },
];
