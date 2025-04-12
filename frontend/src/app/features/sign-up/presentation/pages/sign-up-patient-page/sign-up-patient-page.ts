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
  getPhoneRegexValidator,
  getZipCodeRegexValidator,
  passwordMatchValidator,
} from '../../helpers/forms-validators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../../shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'app-sign-up-patient-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDividerModule,
    CommonModule,
    InputComponent,
  ],
  templateUrl: './sign-up-patient-page.html',
  styleUrl: './sign-up-patient-page.css',
})
export class SignUpPatientPage {
  patientForm: FormGroup = new FormGroup({});
  _isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private signUpService: SignUpService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.patientForm = this.fb.group(
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
      this.handleFailure('Preencha todos os campos corretamente');
      this._isSubmitting = false;
    }
  }

  async registerUser(): Promise<void> {
    const user = this.getPersonalUserObject();
    this._isSubmitting = true;
    this.signUpService.registerPersonalUser(user).subscribe({
      next: (_) => {
        this._isSubmitting = false;
        this.patientForm.reset();
        this.handleSuccessfulRegistration();
      },

      error: (error: String) => {
        this._isSubmitting = false;
        this.handleFailure(error);
      },
    });
  }

  private handleFailure(errorMessage: String) {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: errorMessage,
        type: 'error',
      },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'],
    });

    snackBarRef.afterDismissed().subscribe(() => {
      this.router.navigate(['/signup']);
    });
  }

  private handleSuccessfulRegistration() {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: { message: 'Cadastro realizado com sucesso!', type: 'success' },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar'],
    });

    snackBarRef.afterDismissed().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  private getPersonalUserObject(): PersonalUser {
    const personalUser: PersonalUser = {
      name: this.patientForm.get('name')?.value,
      cpf: this.patientForm.get('cpf')?.value,
      birthdate: this.patientForm.get('birthDate')?.value,
      address: this.getUserAddress(),
      phone: this.patientForm.get('phone')?.value,
      email: this.patientForm.get('email')?.value,
      password: this.patientForm.get('password')?.value,
    };
    return personalUser;
  }

  private getUserAddress(): UserAddress {
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
