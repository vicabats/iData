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
import { MatDividerModule } from '@angular/material/divider';
import { InputComponent } from '../../../../../shared/components/form-components/input/input.component';
import { PersonalUser } from '../../../../../shared/types/personal_user';
import { UserAddress } from '../../../../../shared/types/user_address';
import { SignUpService } from '../../../services/sign-up.service';
import {
  getBirthdateRegexValidator,
  getCPFRegexValidator,
  getNameRegexValidator,
  getPasswordMinLenghtValidator,
  getPasswordRegexValidator,
  getTelephoneRegexValidator,
  getZipCodeRegexValidator,
} from '../../helpers/forms-validators';

@Component({
  selector: 'app-sign-up-patient-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDividerModule,
    CommonModule,
    InputComponent,
    TitleCasePipe,
  ],
  templateUrl: './sign-up-patient-page.html',
  styleUrl: './sign-up-patient-page.css',
})
export class SignUpPatientPage {
  // Melhorias:
  // - Adicionar validação de CPF
  // - Utilizar o componente Datepicker para a data de nascimento
  // - Mostrar mensagem de erro no input somente quando o usuário "sair" do input
  // - Criptografar a senha ao enviá-la pro backend

  patientForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private signUpService: SignUpService) {}

  ngOnInit(): void {
    this.patientForm = this.fb.group(
      {
        name: ['', [Validators.required, getNameRegexValidator()]],
        cpf: ['', [Validators.required, getCPFRegexValidator()]],
        birthDate: ['', [Validators.required, getBirthdateRegexValidator()]],

        street: ['', [Validators.required]],
        addressNumber: ['', [Validators.required]],
        addressComplement: [''],
        zipCode: ['', [Validators.required, getZipCodeRegexValidator()]],
        neighborhood: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        telephone: ['', [Validators.required, getTelephoneRegexValidator()]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            getPasswordMinLenghtValidator(),
            getPasswordRegexValidator(),
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

  getErrorMessage(controlName: string, placeholder?: string): string {
    const control = this.patientForm.get(controlName);
    if (control && control.touched && control.invalid) {
      if (control.errors?.['required']) {
        return 'Este campo não pode ficar em branco.';
      } else if (control.errors?.['pattern']) {
        return 'Formato inválido. Siga o padrão: ' + placeholder;
      }
    }
    return '';
  }

  async trySignUp(): Promise<void> {
    if (this.patientForm.valid) {
      await this.registerUser();
    } else {
      window.alert('Por favor, corrija os campos do formulário.');
    }
  }

  async registerUser(): Promise<void> {
    const user = this.getPersonalUserObject();
    this.signUpService.register(user).subscribe({
      next: (response) => {
        console.log('Cadastro realizado com sucesso:', response);
        window.alert('Cadastro realizado com sucesso!');
        this.patientForm.reset();
      },
      error: (error) => {
        console.error('Erro ao realizar cadastro:', error);
        window.alert('Erro ao realizar cadastro. Por favor, tente novamente.');
      },
    });
  }

  getPersonalUserObject(): PersonalUser {
    const personalUser: PersonalUser = {
      full_name: this.patientForm.get('name')?.value,
      cpf: this.patientForm.get('cpf')?.value,
      birthDate: this.patientForm.get('birthDate')?.value,
      address: this.getUserAddress(),
      telephone: this.patientForm.get('telephone')?.value,
      email: this.patientForm.get('email')?.value,
      password: this.patientForm.get('password')?.value,
    };
    return personalUser;
  }

  getUserAddress(): UserAddress {
    const userAddress: UserAddress = {
      street: this.patientForm.get('street')?.value,
      number: this.patientForm.get('addressNumber')?.value,
      complement: this.patientForm.get('addressComplement')?.value,
      zipCode: this.patientForm.get('zipCode')?.value,
      neighborhood: this.patientForm.get('neighborhood')?.value,
      city: this.patientForm.get('city')?.value,
      state: this.patientForm.get('state')?.value,
    };

    return userAddress;
  }
}
