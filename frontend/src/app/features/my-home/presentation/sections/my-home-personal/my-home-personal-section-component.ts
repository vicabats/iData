import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-home-personal-section-component',
  imports: [],
  templateUrl: './my-home-personal-section-component.html',
  styleUrl: './my-home-personal-section-component.css',
})
export class MyHomePersonalSectionComponent {
  constructor(private router: Router) {}

  public redirectToMedicalRecords(): void {
    this.router.navigate(['medical-records']);
  }

  public redirectToExams(): void {
    this.router.navigate(['my-exams']);
  }

  public redirectToSafetyContact(): void {
    this.router.navigate(['safety-contact']);
  }

  public redirectToInProgress(): void {
    this.router.navigate(['in-progress']);
  }
}
