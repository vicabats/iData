import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputComponent } from '../../../../shared/components/form-components/input/input.component';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-sign-in-patient-page',
  imports: [InputComponent, FormsModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './sign-in-patient-page.html',
  styleUrl: './sign-in-patient-page.css',
})
export class SignInPatientPage {
  patientForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^((?:[^\s]+(?:\s+|$)){2,})$/),
        ],
      ],
      // cpf: ['', [Validators.required, this.cpfValidator]],
    });
  }

  // cpfValidator(control: FormControl): { [key: string]: boolean } | null {
  //   const cpf = control.value;
  //   const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  //   if (cpf && !cpfPattern.test(cpf)) {
  //     return { invalidCpf: true };
  //   }
  //   return null;
  // }

  getErrorMessage(controlName: string): string {
    const control = this.patientForm.get(controlName);
    if (control && control.touched && control.invalid) {
      if (control.errors?.['required']) {
        return 'Este campo é obrigatório';
      } else if (control.errors?.['pattern']) {
        console.log(control.errors);
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
