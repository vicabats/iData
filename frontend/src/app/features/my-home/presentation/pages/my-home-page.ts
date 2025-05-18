import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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
  public userType: UserType | null = null;
  public user: User | null = null;

  public userTypeEnum = UserType;

  constructor(private userSessionService: UserSessionService) {}

  ngOnInit(): void {
    this.userSessionService.user$.subscribe((user) => {
      this.user = user;
    });

    this.userSessionService.userType$.subscribe((userType) => {
      this.userType = userType;
    });
  }
}
