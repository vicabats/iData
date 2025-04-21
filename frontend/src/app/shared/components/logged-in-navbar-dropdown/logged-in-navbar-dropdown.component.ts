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

  public showModal: boolean = false;

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

  public showLogoutModal(): void {
    this.showModal = true;
  }

  public logout(): void {
    this.router.navigate(['']);
    this.showModal = false;
    this.userSessionService.clearSession();
  }

  public closeModal(): void {
    this.showModal = false;
  }
}
