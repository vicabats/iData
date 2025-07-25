import { Component, OnInit } from '@angular/core';
import { UserSessionService } from '../../../../../core/services/user-session/user-session.service';
import {
  MyAccountService,
  MyAccountSuccessResponse,
} from '../../../services/my-account.service';
import { User } from '../../../../../shared/types/user';
import { CommonModule } from '@angular/common';
import { PersonalUserFormComponent } from '../../../../../shared/components/form-components/personal-user-form/personal-user-form.component';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { ProfessionalUserFormComponent } from '../../../../../shared/components/form-components/professional-user-form/professional-user-form.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal/modal.component';
import { UserType } from '../../../../../shared/types/user_type';
import { Router } from '@angular/router';
import { SnackBarComponent } from '../../../../../shared/components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-account-page',
  imports: [
    CommonModule,
    PersonalUserFormComponent,
    ProfessionalUserFormComponent,
    LoadingComponent,
    ModalComponent,
  ],
  templateUrl: './my-account-page.html',
  styleUrl: './my-account-page.css',
})
export class MyAccountPage implements OnInit {
  public userType: UserType | null = null;
  public user: User | null = null;

  public userTypeEnum = UserType;

  public isLoading = true;
  public shouldShowDeleteAccountModal: boolean = false;

  constructor(
    private userSessionService: UserSessionService,
    private myAccountService: MyAccountService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userSessionService.userType$.subscribe((userType) => {
      this.userType = userType;
    });

    this.myAccountService
      .getUserInfos({
        type: this.userSessionService.getUserType() as UserType,
        cpf: this.userSessionService.getUser()?.cpf as string,
      })
      .subscribe({
        next: (response) => this.handleGetUserInfosSuccess(response),
        error: (error) => this.handleGetUserFailure(error.message),
      });
  }

  private handleGetUserInfosSuccess(loggedUser: User): void {
    this.user = loggedUser;
    this.userSessionService.setSession(loggedUser);
    this.isLoading = false;
  }

  private handleGetUserFailure(errorMessage: string): void {
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
      this.router.navigate(['login']);
    });
  }

  public goBackToMyHome(): void {
    this.router.navigate(['my-home']);
  }

  public updateAccount() {
    this.router.navigate(['my-account', this.userType, 'edit']);
  }

  public openDeleteAccountModal(): void {
    this.shouldShowDeleteAccountModal = true;
  }

  public closeDeleteAccountModal(): void {
    this.shouldShowDeleteAccountModal = false;
  }

  public initializeAccountDeletion(): void {
    this.isLoading = true;
    this.shouldShowDeleteAccountModal = false;

    this.myAccountService
      .deleteAccount({
        type: this.userType as UserType,
        cpf: this.user?.cpf as string,
        password: this.user?.password as string,
      })
      .subscribe({
        next: (response) => this.handleStartDeletingAccountSuccess(response),
        error: (error) => this.handleStartDeletingAccountFailure(error.message),
      });
  }

  private handleStartDeletingAccountSuccess(
    response: MyAccountSuccessResponse
  ): void {
    this.isLoading = false;
    this.userSessionService.setHasInitializedDeleteAccount(true);
    this.router.navigate(['my-account', this.userType, 'delete'], {
      state: {
        message: response.message,
        userType: this.userType,
        cpf: this.user?.cpf,
      },
    });
  }

  private handleStartDeletingAccountFailure(errorMessage: string): void {
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
      this.shouldShowDeleteAccountModal = false;
    });
  }
}
