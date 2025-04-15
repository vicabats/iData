import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { User } from '../../shared/types/user';

const USER_SESSION_KEY = 'user_session';

export interface UserSession {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  constructor(private storage: StorageService) {}

  public setSession(session: UserSession): void {
    this.storage.setItem(USER_SESSION_KEY, session);
  }

  public getSession(): UserSession | null {
    return this.storage.getItem<UserSession>(USER_SESSION_KEY);
  }

  public clearSession(): void {
    this.storage.removeItem(USER_SESSION_KEY);
  }

  public isLoggedIn(): boolean {
    const session = this.getSession();
    return !!session;
  }
}
