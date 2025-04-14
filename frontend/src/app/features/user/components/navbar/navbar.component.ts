import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'user-navbar',
  imports: [],
  templateUrl: './user.navbar.component.html',
  styleUrl: './user.navbar.component.css'
})
export class UserNavbarComponent {

  constructor(private router: Router) { }

  redirectToMedicalRecordy(): void {
    this.router.navigate(['about-us']);
  }

  redirectToExams(): void {
    this.router.navigate(['login']);
  }

  redirectToSafetyContact(): void {
    this.router.navigate(['/']);
  }
}
