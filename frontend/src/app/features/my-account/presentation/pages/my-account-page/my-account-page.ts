import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserSessionService } from '../../../../../core/services/user-session/user-session.service';

@Component({
  selector: 'app-my-account-page',
  imports: [],
  templateUrl: './my-account-page.html',
  styleUrl: './my-account-page.css',
})
export class MyAccountPage {
  public userType$!: Observable<string | null>;

  constructor(private userSessionService: UserSessionService) {
    this.userType$ = this.userSessionService.userType$;
  }
}
