import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-personal-section-component',
  imports: [],
  templateUrl: './personal-section-component.html',
  styleUrl: './personal-section-component.css',
})
export class ProfilePersonalSectionComponent {
  constructor(private router: Router) {}

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
