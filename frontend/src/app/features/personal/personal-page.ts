import { Component } from '@angular/core';
import { PersonalNavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-personal-page',
  imports: [PersonalNavbarComponent],
  templateUrl: './personal-page.html',
  styleUrl: './personal-page.css',
})
export class PersonalPage {}
