import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-home-professional-section-component',
  imports: [],
  templateUrl: './my-home-professional-section-component.html',
  styleUrl: './my-home-professional-section-component.css',
})
export class MyHomeProfessionalSectionComponent {
  constructor(private router: Router) {}

  public redirectToSharedExams(): void {
    this.router.navigate(['shared-exams']);
  }
}
