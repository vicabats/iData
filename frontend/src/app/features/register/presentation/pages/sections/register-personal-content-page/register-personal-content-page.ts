import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { InputComponent } from '../../../../../../shared/components/form-components/input/input.component';
import {
  getBirthdateRegexValidator,
  getCPFRegexValidator,
  getNameRegexValidator,
  getPasswordMinLenghtValidator,
  getPasswordRegexValidator,
  getPhoneRegexValidator,
  getZipCodeRegexValidator,
  passwordMatchValidator,
} from '../../../helpers/forms-validators';
import { PersonalUser } from '../../../../../../shared/types/personal_user';
import { UserAddress } from '../../../../../../shared/types/user_address';

@Component({
  selector: 'app-register-personal-content-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDividerModule,
    CommonModule,
    InputComponent,
  ],
  templateUrl: './register-personal-content-page.html',
  styleUrl: './register-personal-content-page.css',
})
export class RegisterPersonalContentPage implements OnInit {
  @Output() submitForm = new EventEmitter<PersonalUser>();

  public personalForm: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.personalForm = this.formBuilder.group(
      {
        name: ['', [Validators.required, getNameRegexValidator()]],
        cpf: ['', [Validators.required, getCPFRegexValidator()]],
        birthdate: ['', [Validators.required, getBirthdateRegexValidator()]],
        street: ['', [Validators.required]],
        addressNumber: ['', [Validators.required]],
        addressComplement: [''],
        zipCode: ['', [Validators.required, getZipCodeRegexValidator()]],
        neighborhood: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        phone: ['', [Validators.required, getPhoneRegexValidator()]],
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
      { validators: passwordMatchValidator }
    );
  }

  public getErrorMessage(controlName: string, placeholder?: string): string {
    const control = this.personalForm.get(controlName);
    if (control && control.touched && control.invalid) {
      if (control.errors?.['required']) {
        return 'Este campo não pode ficar em branco.';
      } else if (control.errors?.['pattern']) {
        return 'Formato inválido. Siga o padrão: ' + placeholder;
      }
    }
    return '';
  }

  public tryRegister(): void {
    if (this.personalForm.valid) {
      const user = this.getPersonalUserObject();
      this.submitForm.emit(user);
    } else {
      this.personalForm.markAllAsTouched();
    }
  }

  private getPersonalUserObject(): PersonalUser {
    const personalUser: PersonalUser = {
      name: this.personalForm.get('name')?.value,
      cpf: this.personalForm.get('cpf')?.value,
      birthdate: this.personalForm.get('birthdate')?.value,
      address: this.getUserAddress(),
      phone: this.personalForm.get('phone')?.value,
      email: this.personalForm.get('email')?.value,
      password: this.personalForm.get('password')?.value,
    };
    return personalUser;
  }

  private getUserAddress(): UserAddress {
    const userAddress: UserAddress = {
      street: this.personalForm.get('street')?.value,
      number: this.personalForm.get('addressNumber')?.value,
      complement: this.personalForm.get('addressComplement')?.value,
      zipCode: this.personalForm.get('zipCode')?.value,
      neighborhood: this.personalForm.get('neighborhood')?.value,
      city: this.personalForm.get('city')?.value,
      state: this.personalForm.get('state')?.value,
    };
    return userAddress;
  }
}
