import { Component, Input, OnInit } from '@angular/core';
import { InputComponent } from '../../../../../shared/components/form-components/input/input.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { AuthFlowGuardService } from '../../../../../core/services/auth/auth-flow-guard.service';
import { User } from '../../../../../shared/types/user';
import { SnackBarComponent } from '../../../../../shared/components/snack-bar/snack-bar.component';
import { UserType } from '../../../../../shared/types/user_type';

@Component({
  selector: 'app-login-content-page',
  imports: [
    InputComponent,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    CommonModule,
    LoadingComponent,
  ],
  templateUrl: './login-content-page.html',
  styleUrl: './login-content-page.css',
})
export class LoginContentPage implements OnInit {
  @Input({ required: true }) userType!: UserType;

  public loginForm: FormGroup = new FormGroup({});
  public isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private loginService: LoginService,
    private authFlowGuardService: AuthFlowGuardService
  ) {}

  ngOnInit(): void {
    this.initializeLoginForm();
  }

  private initializeLoginForm() {
    this.loginForm = this.fb.group({
      cpf: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/),
        ],
      ],
    });
  }

  public login(): void {
    if (!this.loginForm.valid) {
      this.handleFailure('Preencha todos os campos corretamente');
      return;
    }

    this.isSubmitting = true;
    const { cpf, password } = this.loginForm.value;

    this.loginService.login({ cpf, password, type: this.userType }).subscribe({
      next: (response) => this.handleSuccessfulLogin(response),
      error: (error) => this.handleFailure(error.message),
    });
  }

  private getLoginUser(): User {
    const loginUser: User = {
      cpf: this.loginForm.get('cpf')?.value,
      password: this.loginForm.get('password')?.value,
    };
    return loginUser;
  }

  private handleSuccessfulLogin(response: { message: string; data: string }) {
    this.authFlowGuardService.setLoginFlowStarted(true);
    this.isSubmitting = false;

    this.router.navigate(['verify-code'], {
      state: { successMessage: response.message },
      queryParams: {
        type: this.userType,
        cpf: this.loginForm.get('cpf')?.value,
      },
    });
  }

  private handleFailure(errorMessage: string) {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: errorMessage,
        type: 'error',
      },
      duration: 1500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'],
    });

    snackBarRef.afterDismissed().subscribe(() => {
      this.isSubmitting = false;
    });
  }

  public getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control && control.touched && control.invalid) {
      if (control.errors?.['required']) {
        return 'Este campo é obrigatório';
      } else if (control.errors?.['pattern']) {
        return 'Formato inválido';
      }
    }
    return '';
  }

  public redirectToSignUp(): void {
    this.router.navigate(['signup']);
  }

  public redirectToForgotPassword(): void {
    this.router.navigate(['forgot-password']);
  }
}
