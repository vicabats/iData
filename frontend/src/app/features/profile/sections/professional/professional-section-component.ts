import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-professional-section-component',
  imports: [ProfileProfessionalSectionComponent],
  templateUrl: './professional-section-component.html',
  styleUrl: './professional-section-component.css',
})
export class ProfileProfessionalSectionComponent {
  constructor(private router: Router) {}

  redirectToLogs(): void {
    this.router.navigate(['logs']);
  }

  redirectToInProgress(): void {
    this.router.navigate(['in-progress']);
  }
}
