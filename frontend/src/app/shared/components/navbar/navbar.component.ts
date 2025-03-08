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

  redirectToAboutUs() {
    console.log('Redirecionar para sobre nós');
  }

  redirectToAuthentication() {
    console.log('Redirecionar para login');
  }

  redirectToHomepage() {
    this.router.navigate(['/']);
  }
}
