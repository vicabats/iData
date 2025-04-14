import { Component } from '@angular/core';
import { UserNavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-user-page',
  imports: [UserNavbarComponent],
  templateUrl: './user-page.html',
  styleUrl: './user-page.css',
})
export class UserPage {}
