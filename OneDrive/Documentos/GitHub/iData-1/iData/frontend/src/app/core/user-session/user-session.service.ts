import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { User } from '../../shared/types/user';

const USER_LOGGED_KEY = 'user_logged';
const USER_TYPE = 'user_type';

export interface UserSession {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userTypeSubject = new BehaviorSubject<string | null>(null);
  userType$ = this.userTypeSubject.asObservable();

  constructor(private storage: StorageService) {
    this.isLoggedInSubject.next(this.hasSession());
    this.userTypeSubject.next(this.getUserTypeFromStorage());
  }

  private hasSession(): boolean {
    const session = this.getSession();
    return !!session;
  }

  private getUserTypeFromStorage(): string | null {
    return this.storage.getItem<string>(USER_TYPE);
  }

  public setSession(user: User): void {
    this.storage.setItem(USER_LOGGED_KEY, user);
    this.isLoggedInSubject.next(true);
  }

  public setUserType(userType: string): void {
    this.storage.setItem(USER_TYPE, userType);
    this.userTypeSubject.next(userType);
  }

  public getSession(): UserSession | null {
    return this.storage.getItem<UserSession>(USER_LOGGED_KEY);
  }

  public getUserType(): string | null {
    return this.storage.getItem<string>(USER_TYPE);
  }

  public clearSession(): void {
    this.storage.removeItem(USER_LOGGED_KEY);
    this.storage.removeItem(USER_TYPE);
    this.isLoggedInSubject.next(false);
    this.userTypeSubject.next(null);
  }

  public isLoggedIn(): boolean {
    return this.isLoggedInSubject.getValue();
  }
}
