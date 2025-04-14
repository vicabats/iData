import { Component } from '@angular/core';
import { PersonalNavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-personal-page',
  imports: [PersonalNavbarComponent],
  templateUrl: './user-personal.html',
  styleUrl: './user-personal.css',
})
export class UserPage {}
