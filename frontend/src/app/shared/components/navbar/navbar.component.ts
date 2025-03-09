import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private router: Router) { }

  redirectToAboutUs(): void {
    console.log('Redirecionar para sobre nós');
  }

  redirectToLogin(): void {
    this.router.navigate(['login']);
  }

  redirectToHomepage(): void {
    this.router.navigate(['/']);
  }
}
