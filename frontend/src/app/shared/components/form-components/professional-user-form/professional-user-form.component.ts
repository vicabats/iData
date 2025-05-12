import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProfessionalUser } from '../../../types/professional_user';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  getBirthdateRegexValidator,
  getCPFRegexValidator,
  getNameRegexValidator,
  getPasswordMinLenghtValidator,
  getPasswordRegexValidator,
  getPhoneRegexValidator,
  getZipCodeRegexValidator,
  passwordMatchValidator,
} from '../../../../features/register/presentation/helpers/forms-validators';
import { UserAddress } from '../../../types/user_address';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-professional-user-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDividerModule,
    InputComponent,
  ],
  templateUrl: './professional-user-form.component.html',
  styleUrl: './professional-user-form.component.css',
})
export class ProfessionalUserFormComponent implements OnInit {
  @Input() initialData: ProfessionalUser | null = null;
  @Input({ required: true }) mode!: 'register' | 'edit' | 'view';
  @Input({ required: true }) buttonLabel!: string;
  @Output() onSubmit = new EventEmitter<ProfessionalUser>();

  public professionalForm: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    // if (this.initialData) {
    //   this.populateForm(this.initialData);
    // }
    // if (this.mode === 'view') {
    //   this.personalForm.disable();
    // }
  }

  private initializeForm() {
    this.professionalForm = this.formBuilder.group(
      {
        name: ['', [Validators.required, getNameRegexValidator()]],
        cpf: ['', [Validators.required, getCPFRegexValidator()]],
        birthdate: ['', [Validators.required, getBirthdateRegexValidator()]],
        professionalLicense: ['', [Validators.required]],
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

  public onSubmitButtonClicked(): void {
    if (this.professionalForm.valid) {
      const user = this.getProfessionalUserObject();
      this.onSubmit.emit(user);
    } else {
      this.professionalForm.markAllAsTouched();
    }
  }

  private getProfessionalUserObject(): ProfessionalUser {
    const professionalUser: ProfessionalUser = {
      name: this.professionalForm.get('name')?.value,
      cpf: this.professionalForm.get('cpf')?.value,
      professionalLicense: this.professionalForm.get('professionalLicense')
        ?.value,
      birthdate: this.professionalForm.get('birthDate')?.value,
      facility: this.getUserAddress(),
      phone: this.professionalForm.get('phone')?.value,
      email: this.professionalForm.get('email')?.value,
      password: this.professionalForm.get('password')?.value,
    };

    return professionalUser;
  }

  private getUserAddress(): UserAddress {
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
