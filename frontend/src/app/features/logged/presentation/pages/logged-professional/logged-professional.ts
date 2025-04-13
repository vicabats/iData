import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
  ],
  templateUrl: './logged-professional.html',
  styleUrl: './logged-professional.css',
})
export class LoggedProfessional {}
