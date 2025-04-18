import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from '../modal/modal/modal.component';
import { CommonModule } from '@angular/common';
import { UserSessionService } from '../../../core/user-session/user-session.service';

@Component({
  selector: 'app-logged-in-dropdown',
  standalone: true,
  imports: [ModalComponent, CommonModule],
  templateUrl: './logged-in-dropdown.component.html',
  styleUrls: ['./logged-in-dropdown.component.css'],
})
export class LoggedInDropdownComponent {
  showModal: boolean = false;

  constructor(
    private router: Router,
    private userSessionService: UserSessionService
  ) {}

  redirectToMyData(): void {
    this.router.navigate(['personal']);
  }

  showLogoutModal(): void {
    this.showModal = true;
  }

  logout(): void {
    this.router.navigate(['']);
    this.showModal = false;
    this.userSessionService.clearSession();
  }

  closeModal(): void {
    this.showModal = false;
  }
}
