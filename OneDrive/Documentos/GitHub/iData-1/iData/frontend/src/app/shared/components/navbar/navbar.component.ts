import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input() isLoggedIn!: boolean;

  constructor(private router: Router) {}

  redirectToAboutUs(): void {
    this.router.navigate(['about-us']);
  }

  redirectToLogin(): void {
    this.router.navigate(['login']);
  }

  redirectToHomepage(): void {
    this.router.navigate(['/']);
  }

  redirectToProfile(): void {
    this.router.navigate(['personal']);
  }
}
