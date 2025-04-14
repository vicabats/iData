import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'personal-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class PersonalNavbarComponent {

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
