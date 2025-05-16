import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import {
  DeleteAccountResponse,
  DeleteAccountService,
} from '../../services/delete-account.service';
import { SnackBarComponent } from '../../../../shared/components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserSessionService } from '../../../../core/services/user-session/user-session.service';

@Component({
  selector: 'app-delete-account-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoadingComponent,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './delete-account-page.html',
  styleUrl: './delete-account-page.css',
})
export class DeleteAccountPage implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private deleteAccountService: DeleteAccountService,
    private snackBar: MatSnackBar,
    private router: Router,
    private userSessionService: UserSessionService
  ) {}
  public codeForm: FormGroup = new FormGroup({});
  public isSubmitting = false;
  public message: string = '';

  private userCpf!: string;
  private userType!: string;

  ngOnInit(): void {
    this.initializeDeleteAccountForm();
    this.getRouteParams();
  }

  private initializeDeleteAccountForm(): void {
    this.codeForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  private getRouteParams(): void {
    const navigation = history.state;

    this.message = navigation['message'] || '';
    this.userCpf = navigation['cpf'] || '';
    this.userType = navigation['userType'] || '';
  }

  public submitCode(): void {
    if (this.codeForm.valid) {
      this.isSubmitting = true;
      this.verifyCode();
    }
  }

  private verifyCode(): void {
    const code = this.codeForm.get('code')?.value;

    this.deleteAccountService
      .deleteAccount({
        type: this.userType,
        cpf: this.userCpf,
        code,
      })
      .subscribe({
        next: (response: DeleteAccountResponse) => {
          this.handleSuccessResponse(response);
        },
        error: (error) => {
          // this.handleFailure(error.message);
        },
      });
  }

  private handleSuccessResponse(response: DeleteAccountResponse): void {
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
      this.userSessionService.clearSession();
      this.isSubmitting = false;
      this.router.navigate(['login']);
    });
  }
}
