import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProfilePersonalSectionComponent } from '../sections/personal/personal-section-component';
import { UserSessionService } from '../../../../../core/services/user-session/user-session.service';
import { User } from '../../../../../shared/types/user';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ProfilePersonalSectionComponent],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit {
  public userType$!: Observable<string | null>;
  public user$!: Observable<User | null>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userSessionService: UserSessionService
  ) {
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
