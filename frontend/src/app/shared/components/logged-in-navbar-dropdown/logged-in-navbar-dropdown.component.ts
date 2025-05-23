import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from '../modal/modal/modal.component';
import { CommonModule } from '@angular/common';
import { UserSessionService } from '../../../core/services/user-session/user-session.service';
import { UserType } from '../../types/user_type';

@Component({
  selector: 'app-logged-in-navbar-dropdown',
  standalone: true,
  imports: [ModalComponent, CommonModule],
  templateUrl: './logged-in-navbar-dropdown.component.html',
  styleUrls: ['./logged-in-navbar-dropdown.component.css'],
})
export class LoggedInNavbarDropdownComponent {
  public userTypeEnum = UserType;

  public shouldShowLogoutModal: boolean = false;

  constructor(
    private router: Router,
    private userSessionService: UserSessionService
  ) {}

  public redirectToMyHome(): void {
    this.router.navigate(['my-home']);
  }

  public redirectToMyAccount(): void {
    this.router.navigate(['my-account']);
  }

  public redirectToUpdatePassword(): void {
    this.router.navigate([
      'my-account',
      this.userSessionService.getUserType(),
      'update-password',
    ]);
  }

  public showLogoutModal(): void {
    this.shouldShowLogoutModal = true;
  }

  public logout(): void {
    this.router.navigate(['']);
    this.shouldShowLogoutModal = false;
    this.userSessionService.clearSession();
  }

  public closeModal(): void {
    this.shouldShowLogoutModal = false;
  }
}
