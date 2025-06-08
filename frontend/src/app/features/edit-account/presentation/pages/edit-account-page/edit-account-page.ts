import { Component, OnInit } from '@angular/core';
import { UserType } from '../../../../../shared/types/user_type';
import { User } from '../../../../../shared/types/user';
import { UserSessionService } from '../../../../../core/services/user-session/user-session.service';
import { CommonModule } from '@angular/common';
import { PersonalUserFormComponent } from '../../../../../shared/components/form-components/personal-user-form/personal-user-form.component';
import { ProfessionalUserFormComponent } from '../../../../../shared/components/form-components/professional-user-form/professional-user-form.component';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import {
  EditAccountService,
  EditAccountSuccessResponse,
} from '../../../services/edit-account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../../shared/components/snack-bar/snack-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-account-page',
  imports: [
    CommonModule,
    PersonalUserFormComponent,
    ProfessionalUserFormComponent,
    LoadingComponent,
  ],
  templateUrl: './edit-account-page.html',
  styleUrl: './edit-account-page.css',
})
export class EditAccountPage implements OnInit {
  public userType: UserType | null = null;
  public user: User | null = null;

  public userTypeEnum = UserType;
  public isLoading = true;

  constructor(
    private userSessionService: UserSessionService,
    private editAccountService: EditAccountService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSessionService.user$.subscribe((user) => {
      this.user = user;
    });

    this.userSessionService.userType$.subscribe((userType) => {
      this.userType = userType;
    });

    if (this.user && this.userType) {
      this.isLoading = false;
    }
  }

  public updateUser(user: User): void {
    this.isLoading = true;

    this.editAccountService
      .editAccount({
        type: this.userType as UserType,
        user: user as User,
      })
      .subscribe({
        next: (response) => this.handleEditAccountSuccess(response),
        error: (error) => this.handleFailure(error.message),
      });
  }

  private handleEditAccountSuccess(response: EditAccountSuccessResponse): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: response.message,
        type: 'success',
      },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar'],
    });

    snackBarRef.afterDismissed().subscribe(() => {
      this.isLoading = false;
      this.router.navigate(['my-account']);
    });
  }

  private handleFailure(errorMessage: string): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: errorMessage,
        type: 'error',
      },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'],
    });

    snackBarRef.afterDismissed().subscribe(() => {
      this.isLoading = false;
    });
  }

  public goBackToMyAccount(): void {
    this.router.navigate(['my-account']);
  }
}
