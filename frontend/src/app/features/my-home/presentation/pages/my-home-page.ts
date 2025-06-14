import { Component, OnInit } from '@angular/core';
import { filter, Observable, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserSessionService } from '../../../../core/services/user-session/user-session.service';
import { User } from '../../../../shared/types/user';
import { MyHomePersonalSectionComponent } from '../sections/my-home-personal/my-home-personal-section-component';
import { MyHomeProfessionalSectionComponent } from '../sections/my-home-professional/my-home-professional-section-component';
import { UserType } from '../../../../shared/types/user_type';

@Component({
  selector: 'app-my-home-page',
  standalone: true,
  imports: [
    CommonModule,
    MyHomePersonalSectionComponent,
    MyHomeProfessionalSectionComponent,
  ],
  templateUrl: './my-home-page.html',
  styleUrl: './my-home-page.css',
})
export class MyHomePage implements OnInit {
  public userType$!: Observable<UserType | null>;
  public user$!: Observable<User | null>;

  public userType: UserType | null = null;
  public user: User | null = null;

  public userTypeEnum = UserType;

  public isLoading = true;

  constructor(private userSessionService: UserSessionService) {}

  ngOnInit(): void {
    this.userSessionService.user$
      .pipe(
        filter((user) => !!user),
        switchMap((user) => {
          this.user = user;
          return this.userSessionService.userType$;
        })
      )
      .subscribe((userType) => {
        this.userType = userType;
      });

    if (this.user && this.userType) {
      this.isLoading = false;
    }
  }
}
