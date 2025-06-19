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

  public redirectToExams(): void {
    this.router.navigate(['my-exams']);
  }
}
