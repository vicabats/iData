import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { LoginPatientPage } from '../login-patient-page/login-patient-page';
import { LoginProfessionalPage } from '../login-professional-page/login-professional-page';

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    LoginPatientPage,
    LoginProfessionalPage,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {}
