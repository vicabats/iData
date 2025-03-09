import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { SignInPatientPage } from '../sign-in-patient-page/sign-in-patient-page';

@Component({
  selector: 'app-sigin-page',
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    SignInPatientPage,
  ],
  templateUrl: './sigin-page.html',
  styleUrl: './sigin-page.css'
})
export class SiginPage {

}
