import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { UserSessionService } from './core/services/user-session/user-session.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, NavbarComponent, CommonModule],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  public isLoggedIn$!: Observable<boolean>;
  public userType$!: Observable<string | null>;

  constructor(private userSessionService: UserSessionService) {
    this.isLoggedIn$ = this.userSessionService.isLoggedIn$;
    this.userType$ = this.userSessionService.userType$;
  }
}
