import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
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
import { TermsModalComponent } from '../../../../features/register/presentation/components/terms-and-conditions-modal/terms-and-conditions-modal.component';

@Component({
  selector: 'app-professional-user-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDividerModule,
    InputComponent,
    TermsModalComponent,
  ],
  templateUrl: './professional-user-form.component.html',
  styleUrl: './professional-user-form.component.css',
})
export class ProfessionalUserFormComponent implements OnInit {
  @Input() initialData: ProfessionalUser | null = null;
  @Input({ required: true }) mode!: 'register' | 'edit' | 'view';
  @Input() buttonLabel?: string;
  @Output() onSubmit = new EventEmitter<ProfessionalUser>();

  public professionalForm: FormGroup = new FormGroup({});

  private isRegisterMode: boolean = this.mode === 'register';

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
      this.professionalForm.disable({ emitEvent: false });
    }
    this.cdr.detectChanges();
  }

  private initializeForm(): void {
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

  private disableControlsInEditMode(): void {
    if (this.mode !== 'edit') return;

    this.professionalForm.get('name')?.disable();
    this.professionalForm.get('cpf')?.disable();
    this.professionalForm.get('birthdate')?.disable();
    this.professionalForm.get('professionalLicense')?.disable();
    this.professionalForm.get('password')?.disable();
    this.professionalForm.get('confirmPassword')?.disable();
  }

  private populateForm(data: ProfessionalUser): void {
    this.professionalForm.patchValue({
      name: data.name,
      cpf: data.cpf,
      birthdate: data.birthdate,
      professionalLicense: data.professionalLicense,
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
          !this.professionalForm.get(field)?.invalid &&
          this.professionalForm.touched
        );
      });
    }
    return !this.professionalForm.invalid;
  }

  public getErrorMessage(controlName: string, placeholder?: string): string {
    const control = this.professionalForm.get(controlName);
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
      this.professionalForm.markAllAsTouched();
    }
  }

  public onTermsModalClosed(accepted: boolean): void {
    this.showTermsAndConditionsModal = false;
    if (accepted) {
      const user = this.getProfessionalUserObject();
      this.onSubmit.emit(user);
    }
  }

  private getProfessionalUserObject(): ProfessionalUser {
    return {
      name: this.professionalForm.get('name')?.value,
      cpf: this.professionalForm.get('cpf')?.value,
      professionalLicense: this.professionalForm.get('professionalLicense')
        ?.value,
      birthdate: this.professionalForm.get('birthdate')?.value,
      address: this.getUserAddress(),
      phone: this.professionalForm.get('phone')?.value,
      email: this.professionalForm.get('email')?.value,
      password: this.professionalForm.get('password')?.value,
    };
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
