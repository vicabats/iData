import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { PersonalNavbarComponent } from './features/personal/components/navbar/navbar.component';
import { ProfessionalNavbarComponent } from './features/professional/components/navbar/navbar.component';
import { UserSessionService } from './core/user-session/user-session.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FooterComponent,
    NavbarComponent,
    PersonalNavbarComponent,
    ProfessionalNavbarComponent,
    CommonModule,
  ],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  userType$!: Observable<string | null>;

  constructor(private userSessionService: UserSessionService) {
    this.isLoggedIn$ = this.userSessionService.isLoggedIn$;
    this.userType$ = this.userSessionService.userType$;
  }

  ngOnInit(): void {}
}
