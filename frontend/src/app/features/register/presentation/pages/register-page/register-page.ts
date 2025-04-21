import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserType } from '../../../../../shared/types/user_type';
import { RegisterPersonalContentPage } from '../sections/register-personal-content-page/register-personal-content-page';
import { RegisterService } from '../../../services/register.service';
import { PersonalUser } from '../../../../../shared/types/personal_user';
import { ProfessionalUser } from '../../../../../shared/types/professional_user';
import { SnackBarComponent } from '../../../../../shared/components/snack-bar/snack-bar.component';
import { RegisterProfessionalContentPage } from '../sections/register-professional-content-page/register-professional-content-page';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-register-page',
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    RegisterPersonalContentPage,
    RegisterProfessionalContentPage,
    LoadingComponent,
  ],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  public userTypeEnum = UserType;
  public isSubmitting = false;

  constructor(
    private registerService: RegisterService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  public onSubmit(
    user: PersonalUser | ProfessionalUser,
    userType: UserType
  ): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    this.registerService.register({ user, type: userType }).subscribe({
      next: () => {
        this.handleSuccessfulRegistration();
      },
      error: (error: any) => {
        const errorMessage =
          error?.error || 'Erro desconhecido ao registrar usuário';
        this.handleFailure(errorMessage);
      },
    });
  }

  private handleSuccessfulRegistration(): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: { message: 'Cadastro realizado com sucesso!', type: 'success' },
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar'],
    });

    snackBarRef.afterDismissed().subscribe(() => {
      this.isSubmitting = false;
      this.router.navigate(['login']);
    });
  }

  private handleFailure(errorMessage: string): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: { message: errorMessage, type: 'error' },
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'],
    });

    snackBarRef.afterDismissed().subscribe(() => {
      this.isSubmitting = false;
    });
  }
}
