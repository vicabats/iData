import { Component } from '@angular/core';
import { ProfessionalNavbarComponent } from './components/navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-professional-page',
  imports: [ProfessionalNavbarComponent],
  templateUrl: './professional-page.html',
  styleUrl: './professional-page.css',
})
export class ProfessionalPage {

  constructor(private router: Router) { }

  redirectToLogs(): void {
    this.router.navigate(['logs']);
  }
  
  redirectToInProgress(): void {
    this.router.navigate(['in-progress']);
  }
}
