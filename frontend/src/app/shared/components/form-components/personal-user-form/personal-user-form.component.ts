import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
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
import { UserAddress } from '../../../types/user_address';
import { TermsModalComponent } from '../../../../features/register/presentation/components/terms-and-conditions-modal/terms-and-conditions-modal.component';

@Component({
  selector: 'app-personal-user-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDividerModule,
    InputComponent,
    TermsModalComponent,
  ],
  templateUrl: './personal-user-form.component.html',
  styleUrls: ['./personal-user-form.component.css'],
})
export class PersonalUserFormComponent
  implements OnInit, AfterViewInit, OnChanges
{
  @Input() initialData: PersonalUser | null = null;
  @Input({ required: true }) mode!: 'register' | 'edit' | 'view';
  @Input() buttonLabel?: string;
  @Output() onSubmit = new EventEmitter<PersonalUser>();

  public personalForm: FormGroup = new FormGroup({});

  public isRegisterMode: boolean = this.mode === 'register';

  public showTermsAndConditionsModal: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    if (!this.isRegisterMode && this.initialData) {
      this.populateForm(this.initialData);
    }
    this.disableControlsInEditMode();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData'] && changes['initialData'].currentValue) {
      this.initializeForm();
      this.cdr.detectChanges();
    }
  }

  ngAfterViewInit(): void {
    if (this.mode === 'view') {
      this.personalForm.disable({ emitEvent: false });
    }
    this.cdr.detectChanges();
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

  private disableControlsInEditMode(): void {
    if (this.mode !== 'edit') return;

    this.personalForm.get('name')?.disable();
    this.personalForm.get('cpf')?.disable();
    this.personalForm.get('birthdate')?.disable();
    this.personalForm.get('password')?.disable();
    this.personalForm.get('confirmPassword')?.disable();
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
      password: data.password,
      confirmPassword: data.password,
    });
  }

  public isFormEnabled(): boolean {
    if (this.mode === 'edit') {
      const editableFields = [
        'street',
        'addressNumber',
        'addressComplement',
        'zipCode',
        'neighborhood',
        'city',
        'state',
        'phone',
        'email',
      ];
      return editableFields.every((field) => {
        return (
          !this.personalForm.get(field)?.invalid && this.personalForm.touched
        );
      });
    }
    return !this.personalForm.invalid;
  }

  public getErrorMessage(controlName: string, placeholder?: string): string {
    const control = this.personalForm.get(controlName);
    if (control && control.touched && control.invalid) {
      if (control.errors?.['pattern']) {
        return 'Formato inválido. Siga o padrão: ' + placeholder;
      } else if (control.errors?.['email']) {
        return 'E-mail inválido.';
      } else if (control.errors?.['required']) {
        return 'Este campo não pode ficar em branco.';
      }
    }
    return '';
  }

  public onSubmitButtonClicked(): void {
    if (this.isFormEnabled()) {
      this.showTermsAndConditionsModal = true;
    } else {
      this.personalForm.markAllAsTouched();
    }
  }

  public onTermsModalClosed(accepted: boolean): void {
    this.showTermsAndConditionsModal = false;
    if (accepted) {
      const user = this.getPersonalUserObject();
      this.onSubmit.emit(user);
    }
  }

  private getPersonalUserObject(): PersonalUser {
    return {
      name: this.personalForm.get('name')?.value,
      cpf: this.personalForm.get('cpf')?.value,
      birthdate: this.personalForm.get('birthdate')?.value,
      address: this.getUserAddress(),
      phone: this.personalForm.get('phone')?.value,
      email: this.personalForm.get('email')?.value,
      password: this.personalForm.get('password')?.value,
    };
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
