import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'professional-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class ProfessionalNavbarComponent {

  constructor(private router: Router) { }

  redirectToLogs(): void {
    this.router.navigate(['logs']);
  }
  
  redirectToInProgress(): void {
    this.router.navigate(['in-progress']);
  }
}
