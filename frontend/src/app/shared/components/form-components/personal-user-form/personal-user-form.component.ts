import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PersonalUser } from '../../../types/personal_user';
import { InputComponent } from '../input/input.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-personal-user-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDividerModule,
    InputComponent,
  ],
  templateUrl: './personal-user-form.component.html',
  styleUrls: ['./personal-user-form.component.css'],
})
export class PersonalUserFormComponent implements OnInit {
  @Input() initialData: PersonalUser | null = null;
  @Input({ required: true }) mode!: 'register' | 'edit' | 'view';
  @Input({ required: true }) buttonLabel!: string;
  @Output() onSubmit = new EventEmitter<PersonalUser>();

  public personalForm: FormGroup = new FormGroup({});

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

  private initializeForm(): void {
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

  private populateForm(data: PersonalUser): void {
    this.personalForm.patchValue({
      name: data.name,
      cpf: data.cpf,
      birthdate: data.birthdate,
      street: data.address.street,
      addressNumber: data.address.number,
      addressComplement: data.address.complement,
      zipCode: data.address.zipCode,
      neighborhood: data.address.neighborhood,
      city: data.address.city,
      state: data.address.state,
      phone: data.phone,
      email: data.email,
    });
  }

  public getErrorMessage(controlName: string, placeholder?: string): string {
    const control = this.personalForm.get(controlName);
    if (control && control.touched && control.invalid) {
      if (control.errors?.['required']) {
        return 'Este campo não pode ficar em branco.';
      } else if (control.errors?.['pattern']) {
        return 'Formato inválido. Siga o padrão: ' + placeholder;
      } else if (control.errors?.['email']) {
        return 'E-mail inválido.';
      }
    }
    return '';
  }

  public onSubmitButtonClicked(): void {
    if (this.personalForm.valid) {
      const user = this.getPersonalUserObject();
      this.onSubmit.emit(user);
    } else {
      this.personalForm.markAllAsTouched();
    }
  }

  private getPersonalUserObject(): PersonalUser {
    return {
      name: this.personalForm.get('name')?.value,
      cpf: this.personalForm.get('cpf')?.value,
      birthdate: this.personalForm.get('birthdate')?.value,
      address: {
        street: this.personalForm.get('street')?.value,
        number: this.personalForm.get('addressNumber')?.value,
        complement: this.personalForm.get('addressComplement')?.value,
        zipCode: this.personalForm.get('zipCode')?.value,
        neighborhood: this.personalForm.get('neighborhood')?.value,
        city: this.personalForm.get('city')?.value,
        state: this.personalForm.get('state')?.value,
      },
      phone: this.personalForm.get('phone')?.value,
      email: this.personalForm.get('email')?.value,
      password: this.personalForm.get('password')?.value,
    };
  }
}
