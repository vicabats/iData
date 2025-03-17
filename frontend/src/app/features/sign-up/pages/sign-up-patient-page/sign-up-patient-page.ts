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
import { CepService } from '../../../../shared/features/cep/services/cep.service';

@Component({
  selector: 'app-sign-up-patient-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule,
    InputComponent,
    DatepickerComponent,
  ],
  templateUrl: './sign-up-patient-page.html',
  styleUrl: './sign-up-patient-page.css',
})
export class SignUpPatientPage {
  patientForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private cepService: CepService) {}

  ngOnInit(): void {
    this.patientForm = this.fb.group(
      {
        name: ['', [Validators.required, this.getNameRegexValidator()]],
        cpf: ['', [Validators.required, this.getCPFRegexValidator()]],
        birthDate: ['', Validators.required],
        telephone: [
          '',
          [Validators.required, this.getTelephoneRegexValidator()],
        ],
        cep: ['', [Validators.required]],
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

  onCepBlur(): void {
    console.log('oi');
    const cepControl = this.patientForm.get('cep');
    if (cepControl && cepControl.valid) {
      const cepValue = cepControl.value.replace('-', '');
      this.cepService.getAddress(cepValue).subscribe({
        next: (data) => {
          console.log('CEP data:', data);
          // Atualize os campos do formulário com os dados do CEP, se necessário
        },
        error: (error) => {
          console.error('Erro ao buscar CEP:', error);
        },
      });
    }
  }

  getNameRegexValidator(): Validators {
    return Validators.pattern(/^((?:[^\s]+(?:\s+|$)){2,})$/);
  }

  getCPFRegexValidator(): Validators {
    return Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
  }

  getTelephoneRegexValidator(): Validators {
    return Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/);
  }

  getPasswordMinLenghtValidator(): Validators {
    return Validators.minLength(8);
  }

  getPasswordRegexValidator(): Validators {
    return Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/);
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
