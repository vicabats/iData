import { Routes } from '@angular/router';
import { HomePage } from './features/home/pages/home-page/home-page';
import { LoginPage } from './features/login/pages/login-page/login-page';
import { SiginPage } from './features/signin/pages/sigin-page/sigin-page';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'login', component: LoginPage },
    { path: 'signin', component: SiginPage },
];
