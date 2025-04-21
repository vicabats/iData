import { Routes } from '@angular/router';
import { HomePage } from './features/home/pages/home-page/home-page';
import { AboutUsPage } from './features/institutional/about-us-page/about-us-page';
import { ForgotPasswordPage } from './features/forgot-password/pages/forgot-password-page/forgot-password-page';
import { LoginPage } from './features/login/presentation/pages/login-page/login-page';
import { VerifyCodePage } from './features/verify-code/presentation/pages/verify-code/verify-code-page';
import { VerifyCodeGuardService } from './guards/verify-code/verify-code-guard.service';
import { MedicalRecordsPage } from './features/medical-records/medical-records';
import { ExamsPage } from './features/exams/exams';
import { SafetyContactsPage } from './features/safety-contacts/safety-contacts';
import { LogsPage } from './features/logs/logs-page';
import { InProgressPage } from './features/in-progress/in-progress-page';
import { LoggedInGuardService } from './guards/logged-in/logged-in-guard.service';
import { RegisterPage } from './features/register/presentation/pages/register-page/register-page';
import { ProfilePage } from './features/profile/presentation/pages/profile-page/profile-page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'register', component: RegisterPage },
  { path: 'login', component: LoginPage },
  {
    path: 'verify-code',
    component: VerifyCodePage,
    canActivate: [VerifyCodeGuardService],
  },
  {
    path: 'profile',
    component: ProfilePage,
    canActivate: [LoggedInGuardService],
  },
  { path: 'about-us', component: AboutUsPage },
  { path: 'forgot-password', component: ForgotPasswordPage },
  { path: 'medical-records', component: MedicalRecordsPage },
  { path: 'exams', component: ExamsPage },
  { path: 'safety-contact', component: SafetyContactsPage },
  { path: 'logs', component: LogsPage },
  { path: 'in-progress', component: InProgressPage },
];
