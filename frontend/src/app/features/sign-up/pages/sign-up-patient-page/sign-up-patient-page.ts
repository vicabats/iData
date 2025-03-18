import { CommonModule, TitleCasePipe } from '@angular/common';
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
  selector: 'app-sign-up-patient-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule,
    InputComponent,
    DatepickerComponent,
    TitleCasePipe,
  ],
  templateUrl: './sign-up-patient-page.html',
  styleUrl: './sign-up-patient-page.css',
})
export class SignUpPatientPage {
  // Melhorias:
  // - Adicionar validação de CPF
  // - Mostrar mensagem de erro no input somente quando o usuário "sair" do input

  patientForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.patientForm = this.fb.group(
      {
        name: ['', [Validators.required, this.getNameRegexValidator()]],
        cpf: ['', [Validators.required, this.getCPFRegexValidator()]],
        birthDate: ['', [Validators.required, this.getBirthdateValidator()]],
        telephone: [
          '',
          [Validators.required, this.getTelephoneRegexValidator()],
        ],
        street: ['', [Validators.required]],
        zipCode: ['', [Validators.required, this.getZipCodeRegexValidator()]],
        addressNumber: ['', [Validators.required]],
        addressComplement: [''],
        neighborhood: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            this.getPasswordMinLenghtValidator(),
            this.getPasswordRegexValidator(),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  getNameRegexValidator(): Validators {
    return Validators.pattern(/^((?:[^\s]+(?:\s+|$)){2,})$/);
  }

  getBirthdateValidator(): Validators {
    return Validators.pattern(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
    );
  }

  getCPFRegexValidator(): Validators {
    return Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
  }

  getTelephoneRegexValidator(): Validators {
    return Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/);
  }

  getZipCodeRegexValidator(): Validators {
    return Validators.pattern(/^\d{5}-\d{3}$/);
  }

  getPasswordMinLenghtValidator(): Validators {
    return Validators.minLength(6);
  }

  getPasswordRegexValidator(): Validators {
    return Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/);
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  getErrorMessage(controlName: string, placeholder?: string): string {
    const control = this.patientForm.get(controlName);
    if (control && control.touched && control.invalid) {
      if (control.errors?.['required']) {
        return 'Este campo é obrigatório';
      } else if (control.errors?.['pattern']) {
        return 'Formato inválido. Siga o padrão ' + placeholder;
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
