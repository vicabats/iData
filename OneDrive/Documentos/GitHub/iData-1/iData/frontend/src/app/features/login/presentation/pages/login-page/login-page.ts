import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { LoginContentPage } from '../login-content-page/login-content-page';
import { UserType } from '../../../../../shared/types/user_type';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, MatTabsModule, MatIconModule, LoginContentPage],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  public userTypeEnum = UserType;
}
