import { Component } from '@angular/core';
import { PersonalNavbarComponent } from './components/navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal-page',
  imports: [PersonalNavbarComponent],
  templateUrl: './personal-page.html',
  styleUrl: './personal-page.css',
})
export class PersonalPage {
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
