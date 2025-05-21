import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../../../../shared/components/form-components/input/input.component';
import { MatInput, MatInputModule } from '@angular/material/input';
import { UserSessionService } from '../../../../../core/services/user-session/user-session.service';
import {
  getPasswordMinLenghtValidator,
  getPasswordRegexValidator,
} from '../../../../register/presentation/helpers/forms-validators';
import { UpdatePasswordService } from '../../../services/update-password-service';
import { UserType } from '../../../../../shared/types/user_type';
import { User } from '../../../../../shared/types/user';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../../shared/components/snack-bar/snack-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-password-page',
  templateUrl: './update-password-page.html',
  styleUrl: './update-password-page.css',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputComponent,
    MatInputModule,
    LoadingComponent,
  ],
})
export class UpdatePasswordPage implements OnInit {
  public userType: UserType | null = null;
  public user: User | null = null;

  public isLoading = false;

  public passwordForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private userSessionService: UserSessionService,
    private updatePasswordService: UpdatePasswordService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSessionService.userType$.subscribe((userType) => {
      this.userType = userType;
    });

    this.userSessionService.user$.subscribe((user) => {
      this.user = user;
    });

    if (this.user && this.userType) {
      this.isLoading = false;
    }

    this.initializeForm();
  }

  private initializeForm() {
    this.passwordForm = this.formBuilder.group(
      {
        currentPassword: [
          '',
          [Validators.required, this.currentPasswordValidator.bind(this)],
        ],
        newPassword: [
          '',
          [
            Validators.required,
            getPasswordMinLenghtValidator(),
            getPasswordRegexValidator(),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [
          this.passwordMatchValidator,
          this.passwordNotSameValidator,
        ],
      }
    );
  }

  public onSubmit(): void {
    if (this.isLoading) return;

    this.isLoading = true;

    const newPassword = this.passwordForm.get('newPassword')?.value;

    this.updatePasswordService
      .updatePassword({
        user: this.user as User,
        type: this.userType as UserType,
        newPassword,
      })
      .subscribe({
        next: (_) => this.handleSuccessfullUpdate(),
        error: (error) => this.handleFailure(error.message),
      });
  }

  private handleSuccessfullUpdate(): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message:
          'Senha atualizada com sucesso! Para sua segurança, faça login novamente.',
        type: 'success',
      },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar'],
    });

    snackBarRef.afterDismissed().subscribe(() => {
      this.isLoading = false;
      this.userSessionService.clearSession();
      this.router.navigate(['login']);
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

  public isFormValid(): boolean {
    return this.passwordForm.valid && this.passwordForm.touched;
  }

  private currentPasswordValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const sessionCurrentPassword = this.userSessionService.getUser()?.password;
    if (!control.value) return null;
    return control.value === sessionCurrentPassword
      ? null
      : { currentPasswordIncorrect: true };
  }

  public getErrorMessage(controlName: string): string {
    const control = this.passwordForm.get(controlName);
    const formErrors = this.passwordForm.errors;
    if (control && control.touched && control.invalid) {
      if (control.errors?.['currentPasswordIncorrect']) {
        return 'A senha fornecida não corresponde à senha atual';
      } else if (control.errors?.['minlength']) {
        return 'A nova senha deve ter pelo menos 6 caracteres';
      } else if (control.errors?.['pattern']) {
        return 'A nova senha deve conter letras, números e caracteres especiais';
      } else if (control.errors?.['passwordRegex']) {
        return 'A nova senha deve conter pelo menos um número e um caracter especial';
      } else if (control.errors?.['required']) {
        return 'Este campo não pode ficar em branco';
      }
    }
    if (
      controlName === 'confirmPassword' &&
      (this.passwordForm.touched || this.passwordForm.dirty) &&
      formErrors?.['passwordMismatch']
    ) {
      return 'As senhas não coincidem';
    }
    if (
      controlName === 'newPassword' &&
      (this.passwordForm.touched || this.passwordForm.dirty) &&
      formErrors?.['passwordSameAsCurrent']
    ) {
      return 'A nova senha deve ser diferente da senha atual';
    }
    return '';
  }

  private passwordMatchValidator(
    group: AbstractControl
  ): ValidationErrors | null {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private passwordNotSameValidator(
    group: AbstractControl
  ): ValidationErrors | null {
    const currentPassword = group.get('currentPassword')?.value;
    const newPassword = group.get('newPassword')?.value;
    if (currentPassword && newPassword && currentPassword === newPassword) {
      return { passwordSameAsCurrent: true };
    }
    return null;
  }
}
