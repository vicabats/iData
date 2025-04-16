import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VerifyCodeService } from '../../../services/verify-code.service';
import { User } from '../../../../../shared/types/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../../shared/components/snack-bar/snack-bar.component';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { UserType } from '../../../../../shared/types/user_type';

@Component({
  selector: 'app-verify-code-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoadingComponent,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './verify-code-page.html',
  standalone: true,
  styleUrls: ['./verify-code-page.css'],
})
export class VerifyCodePage implements OnInit {
  public codeForm: FormGroup = new FormGroup({});
  public isSubmitting = false;
  public successMessage: string = '';

  private userCpf!: string;
  private userType!: UserType;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private verifyCodeService: VerifyCodeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeVerifyCodeForm();
    this.getRouteParams();
  }

  private initializeVerifyCodeForm() {
    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  private getRouteParams() {
    this.successMessage = history.state['successMessage'] || '';

    this.route.queryParams.subscribe((params) => {
      this.userCpf = params['cpf'];
      this.userType = params['type'];
    });
  }

  public submitCode() {
    if (this.codeForm.valid) {
      this.isSubmitting = true;
      this.verifyCode();
    } else {
      this.snackBar.openFromComponent(SnackBarComponent, {
        data: {
          message: 'Por favor, insira um código válido de 6 dígitos',
          type: 'error',
        },
        duration: 1500,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar'],
      });
    }
  }

  private verifyCode(): void {
    const code = this.codeForm.get('code')?.value;

    this.verifyCodeService
      .verifyCode({ code, type: this.userType, cpf: this.userCpf })
      .subscribe({
        next: (user: User) => {
          this.handleSuccessfulCode(user);
        },
        error: (error) => {
          let errorMessage =
            error ?? 'Erro ao verificar o código. Tente novamente.';
          this.handleFailure(errorMessage);
        },
      });
  }

  private handleSuccessfulCode(user: User) {
    this.isSubmitting = false;
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: 'Código verificado com sucesso!',
        type: 'success',
      },
      duration: 1500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar'],
    });
    this.router.navigate(['user'], { state: { user } });
  }

  private handleFailure(errorMessage: string) {
    this.isSubmitting = false;
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: errorMessage,
        type: 'error',
      },
      duration: 1500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'],
    });
  }
}
