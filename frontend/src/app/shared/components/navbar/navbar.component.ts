import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedInNavbarDropdownComponent } from '../logged-in-navbar-dropdown/logged-in-navbar-dropdown.component';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, LoggedInNavbarDropdownComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input() isLoggedIn!: boolean;

  constructor(private router: Router) {}

  public redirectToAboutUs(): void {
    this.router.navigate(['about-us']);
  }

  public redirectToLogin(): void {
    this.router.navigate(['login']);
  }

  public redirectToHomepage(): void {
    this.router.navigate(['/']);
  }

  public redirectToProfile(): void {
    this.router.navigate(['personal']);
  }
}
