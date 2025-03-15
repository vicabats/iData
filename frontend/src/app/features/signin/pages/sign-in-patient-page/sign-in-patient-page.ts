import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { InputComponent } from '../../../../shared/components/form-components/input/input.component';
import { DatepickerComponent } from '../../../../shared/components/form-components/datepicker/datepicker.component';

@Component({
  selector: 'app-sign-in-patient-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule,
    InputComponent,
    DatepickerComponent,
  ],
  templateUrl: './sign-in-patient-page.html',
  styleUrl: './sign-in-patient-page.css',
})
export class SignInPatientPage {
  patientForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.patientForm = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.pattern(/^((?:[^\s]+(?:\s+|$)){2,})$/),
          ],
        ],
        cpf: [
          '',
          [
            Validators.required,
            Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
          ],
        ],
        birthDate: [''],
        telephone: [
          '',
          [
            Validators.required,
            Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  getErrorMessage(controlName: string): string {
    const control = this.patientForm.get(controlName);
    if (control && control.touched && control.invalid) {
      if (control.errors?.['required']) {
        return 'Este campo é obrigatório';
      } else if (control.errors?.['pattern']) {
        return 'Formato inválido';
      }
    }
    return '';
  }

  trySignUp(): void {
    if (this.patientForm.valid) {
      window.alert('Cadastro realizado!');
      this.patientForm.reset();
    } else {
      window.alert('Por favor, corrija os campos do formulário.');
    }
  }
}
