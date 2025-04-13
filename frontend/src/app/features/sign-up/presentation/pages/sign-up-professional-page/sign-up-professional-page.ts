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
import { ProfessionalUser } from '../../../../../shared/types/professional_user';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../../shared/components/snack-bar/snack-bar.component';

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
  professionalForm: FormGroup = new FormGroup({});
  _isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private signUpService: SignUpService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.professionalForm = this.fb.group(
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
      this.handleFailure('Preencha todos os campos corretamente');
      this._isSubmitting = false;
    }
  }

  async registerUser(): Promise<void> {
    const user = this.getProfessionalUserObject();
    this._isSubmitting = true;
    this.signUpService.registerProfessionalUser(user).subscribe({
      next: (_) => {
        this.professionalForm.reset();
        this.handleSuccessfulRegistration();
      },
      error: (error: any) => {
        this._isSubmitting = false;
        const errorMessage =
          error?.error || 'Erro desconhecido ao registrar usuário';
        this.handleFailure(errorMessage);
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

    this._isSubmitting = false;

    snackBarRef.afterDismissed().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  getProfessionalUserObject(): ProfessionalUser {
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
