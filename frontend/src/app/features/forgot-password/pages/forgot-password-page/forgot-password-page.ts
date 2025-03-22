import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../../shared/components/form-components/input/input.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    CommonModule,
    InputComponent,
  ],
  templateUrl: './forgot-password-page.html',
  styleUrl: './forgot-password-page.css',
})
export class ForgotPasswordPage {
  forgotPasswordForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
        ],
      ],
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.forgotPasswordForm.get(controlName);
    if (control && control.touched && control.invalid) {
      if (control.errors?.['required']) {
        return 'Este campo é obrigatório';
      } else if (control.errors?.['pattern']) {
        return 'Formato inválido';
      }
    }
    return '';
  }

  redirectToLogin(): void {
    this.router.navigate(['login']);
  }
  
  redirectToFortgotPassword(): void {
    this.router.navigate(['forgot-password']);
  }
}
