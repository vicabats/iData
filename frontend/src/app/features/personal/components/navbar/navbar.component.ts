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

  redirectToMedicalRecords(): void {
    this.router.navigate(['medical-records']);
  }

  redirectToExams(): void {
    this.router.navigate(['exams']);
  }

  redirectToSafetyContact(): void {
    this.router.navigate(['safety-contact']);
  }

  redirectToInProgress(): void {
    this.router.navigate(['in-progress']);
  }
}
