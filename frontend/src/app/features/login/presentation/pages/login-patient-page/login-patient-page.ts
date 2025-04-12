import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '../../../../../shared/components/form-components/input/input.component';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { User } from '../../../../../shared/types/user';
import { LoginService } from '../../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../../shared/components/snack-bar/snack-bar.component';
import { AuthFlowGuardService } from '../../../../../core/auth/auth-flow-guard.service';

@Component({
  selector: 'app-login-patient-page',
  imports: [
    InputComponent,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    CommonModule,
  ],
  templateUrl: './login-patient-page.html',
  styleUrl: './login-patient-page.css',
})
export class LoginPatientPage {
  patientLoginForm: FormGroup = new FormGroup({});
  _isSubmitting = false;

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
    this.patientLoginForm = this.fb.group({
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

  public async tryLogin() {
    if (this.patientLoginForm.valid) {
      this._isSubmitting = true;
      await this.registerUser();
    } else {
      this.handleFailure('Preencha todos os campos corretamente');
      this._isSubmitting = false;
    }
  }

  async registerUser(): Promise<void> {
    const user = this.getLoginUser();
    this._isSubmitting = true;
    this.loginService.loginPersonalUser(user).subscribe({
      next: (_) => {
        this.authFlowGuardService.setLoginFlowStarted(true);
        this._isSubmitting = false;
        this.router.navigate(['verify-code']);
      },
      error: (error: String) => {
        this._isSubmitting = false;
        this.handleFailure(error);
      },
    });
  }

  private getLoginUser(): User {
    const loginUser: User = {
      cpf: this.patientLoginForm.get('cpf')?.value,
      password: this.patientLoginForm.get('password')?.value,
    };
    return loginUser;
  }

  private handleFailure(errorMessage: String) {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: errorMessage,
        type: 'error',
      },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'],
    });
  }

  public getErrorMessage(controlName: string): string {
    const control = this.patientLoginForm.get(controlName);
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
