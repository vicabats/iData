import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserSessionService } from '../../../../core/services/user-session/user-session.service';
import { User } from '../../../../shared/types/user';
import { ProfilePersonalSectionComponent } from '../sections/personal/personal-section-component';

@Component({
  selector: 'app-my-home-page',
  standalone: true,
  imports: [CommonModule, ProfilePersonalSectionComponent],
  templateUrl: './my-home-page.html',
  styleUrl: './my-home-page.css',
})
export class MyHomePage implements OnInit {
  public userType$!: Observable<string | null>;
  public user$!: Observable<User | null>;

  constructor(private userSessionService: UserSessionService) {
    this.userType$ = this.userSessionService.userType$;
    this.user$ = this.userSessionService.user$;
  }

  public user: User | null = null;

  ngOnInit(): void {
    this.userSessionService.user$.subscribe((user) => {
      this.user = user;
    });
  }
}
