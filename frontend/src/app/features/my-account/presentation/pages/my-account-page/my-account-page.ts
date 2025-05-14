import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserSessionService } from '../../../../../core/services/user-session/user-session.service';
import { MyAccountService } from '../../../services/my-account.service';
import { User } from '../../../../../shared/types/user';
import { CommonModule } from '@angular/common';
import { PersonalUserFormComponent } from '../../../../../shared/components/form-components/personal-user-form/personal-user-form.component';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { ProfessionalUserFormComponent } from '../../../../../shared/components/form-components/professional-user-form/professional-user-form.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal/modal.component';

@Component({
  selector: 'app-my-account-page',
  imports: [
    CommonModule,
    PersonalUserFormComponent,
    ProfessionalUserFormComponent,
    LoadingComponent,
    ModalComponent,
  ],
  templateUrl: './my-account-page.html',
  styleUrl: './my-account-page.css',
})
export class MyAccountPage implements OnInit {
  public userType$!: Observable<string | null>;
  public user: User | null = null;

  public isLoading = true;

  public shouldShowDeleteAccountModal: boolean = false;

  constructor(
    private userSessionService: UserSessionService,
    private myAccountService: MyAccountService
  ) {}

  ngOnInit(): void {
    this.userType$ = this.userSessionService.userType$;

    this.userSessionService.user$.subscribe((user) => {
      this.user = user as User;

      if (user) {
        this.isLoading = false;
      }
    });

    // Quando o endpoint de GET estiver correto, descomentar o código abaixo.
    // this.userType$.subscribe((userType) => {
    //   this.myAccountService
    //     .getUserInfos({ type: userType as UserType, cpf: loggedUser?.cpf })
    //     .subscribe({
    //       next: (response) => console.log(response),
    //       error: (error) => console.error(error),
    //     });
    // });
  }

  public openDeleteAccountModal(): void {
    this.shouldShowDeleteAccountModal = true;
  }

  public closeDeleteAccountModal(): void {
    this.shouldShowDeleteAccountModal = false;
  }

  public deleteAccount(): void {
    this.shouldShowDeleteAccountModal = false;

    this.myAccountService
      .deleteAccount({
        type: this.user!.type!,
        cpf: this.user!.cpf,
        password: this.user?.password,
      })
      .subscribe({
        next: (response) => console.log(response),
        error: (error) => console.error(error),
      });
  }
}
