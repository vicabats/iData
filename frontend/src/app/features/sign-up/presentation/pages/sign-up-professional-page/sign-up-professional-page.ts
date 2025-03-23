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
  selector: 'app-sign-up-professional-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDividerModule,
    CommonModule,
    InputComponent,
    TitleCasePipe,
  ],
  templateUrl: './sign-up-professional-page.html',
  styleUrl: './sign-up-professional-page.css',
})
export class SignUpProfessionalPage {
  // Melhorias:
  // - Adicionar validação de CPF
  // - Utilizar o componente Datepicker para a data de nascimento
  // - Mostrar mensagem de erro no input somente quando o usuário "sair" do input
  // - Criptografar a senha ao enviá-la pro backend

  professionalForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private signUpService: SignUpService) {}

  ngOnInit(): void {
    this.professionalForm = this.fb.group(
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
    const control = this.professionalForm.get(controlName);
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
    if (this.professionalForm.valid) {
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
        this.professionalForm.reset();
      },
      error: (error) => {
        console.error('Erro ao realizar cadastro:', error);
        window.alert('Erro ao realizar cadastro. Por favor, tente novamente.');
      },
    });
  }

  getPersonalUserObject(): PersonalUser {
    const personalUser: PersonalUser = {
      full_name: this.professionalForm.get('name')?.value,
      cpf: this.professionalForm.get('cpf')?.value,
      birthDate: this.professionalForm.get('birthDate')?.value,
      address: this.getUserAddress(),
      telephone: this.professionalForm.get('telephone')?.value,
      email: this.professionalForm.get('email')?.value,
      password: this.professionalForm.get('password')?.value,
    };
    return personalUser;
  }

  getUserAddress(): UserAddress {
    const userAddress: UserAddress = {
      street: this.professionalForm.get('street')?.value,
      number: this.professionalForm.get('addressNumber')?.value,
      complement: this.professionalForm.get('addressComplement')?.value,
      zipCode: this.professionalForm.get('zipCode')?.value,
      neighborhood: this.professionalForm.get('neighborhood')?.value,
      city: this.professionalForm.get('city')?.value,
      state: this.professionalForm.get('state')?.value,
    };

    return userAddress;
  }
}
