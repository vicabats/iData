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
import {
  VerifyCodeApiResponse,
  VerifyCodeService,
} from '../../../services/verify-code.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../../shared/components/snack-bar/snack-bar.component';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { UserType } from '../../../../../shared/types/user_type';
import { UserSessionService } from '../../../../../core/services/user-session/user-session.service';
import { LoginService } from '../../../../login/services/login.service';
import { AuthFlowService } from '../../../../../core/services/auth-flow/auth-flow.service';

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
  public canResendCode = false;
  public resendCountdown = 180;
  private countdownInterval: any;

  private userCpf!: string;
  private userType!: UserType;
  private userPassword!: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private verifyCodeService: VerifyCodeService,
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private userSessionService: UserSessionService,
    private authFlowService: AuthFlowService
  ) {}

  ngOnInit(): void {
    this.initializeVerifyCodeForm();
    this.getRouteParams();
    this.startResendCooldown();
  }

  private initializeVerifyCodeForm(): void {
    this.codeForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  private getRouteParams(): void {
    const navigation = history.state;

    this.successMessage = navigation['successMessage'] || '';
    this.userCpf = navigation['cpf'] || '';
    this.userPassword = navigation['password'] || '';

    this.route.queryParams.subscribe((params) => {
      this.userType = params['type'];
    });
  }

  private startResendCooldown(): void {
    this.canResendCode = false;
    this.resendCountdown = 180;

    this.countdownInterval = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        clearInterval(this.countdownInterval);
        this.canResendCode = true;
      }
    }, 1000);
  }

  public submitCode(): void {
    if (this.codeForm.valid) {
      this.isSubmitting = true;
      this.verifyCode();
    }
  }

  private verifyCode(): void {
    const code = this.codeForm.get('code')?.value;
    this.verifyCodeService
      .verifyCode({ code, type: this.userType, cpf: this.userCpf })
      .subscribe({
        next: (response) => this.handleSuccessfulCode(response),
        error: (error) => this.handleFailure(error.message),
      });
  }

  private handleSuccessfulCode(response: VerifyCodeApiResponse): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: response.message,
        type: 'success',
      },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar'],
    });

    snackBarRef.afterDismissed().subscribe(() => {
      this.isSubmitting = false;
      this.authFlowService.clearLoginFlow();
      this.userSessionService.setSession(response.data);
      this.userSessionService.setUserType(this.userType);
      this.redirectToUserPage();
    });
  }

  private redirectToUserPage(): void {
    this.router.navigate(['my-home']);
  }

  private handleFailure(errorMessage: string): void {
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
      this.isSubmitting = false;
      this.codeForm.reset();
    });
  }

  public resendCode(): void {
    if (!this.canResendCode) return;

    this.isSubmitting = true;
    this.canResendCode = false;
    clearInterval(this.countdownInterval);

    this.loginService
      .login({
        cpf: this.userCpf,
        password: this.userPassword,
        type: this.userType,
      })
      .subscribe({
        next: (_) => {
          this.handleSuccessfulLogin();
          this.startResendCooldown();
        },
        error: (error) => this.handleFailure(error.message),
      });
  }

  private handleSuccessfulLogin(): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: 'Código reenviado!',
        type: 'success',
      },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar'],
    });

    snackBarRef.afterDismissed().subscribe(() => {
      this.isSubmitting = false;
    });
  }
}
