import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { SignUpPatientPage } from '../sign-up-patient-page/sign-up-patient-page';
import { SignUpProfessionalPage } from '../sign-up-professional-page/sign-up-professional-page';

@Component({
  selector: 'app-signup-page',
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    SignUpPatientPage,
    SignUpProfessionalPage,
  ],
  templateUrl: './sign-up-page.html',
  styleUrl: './sign-up-page.css',
})
export class SignUpPage {}
