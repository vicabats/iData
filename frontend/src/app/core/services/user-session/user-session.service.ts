import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { User } from '../../../shared/types/user';
import { UserType } from '../../../shared/types/user_type';

const USER_LOGGED_KEY = 'user_logged';
const USER_TYPE = 'user_type';
const HAS_INITIALIZED_DELETE_ACCOUNT = 'has_initialized_delete_account';

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

  private userTypeSubject = new BehaviorSubject<UserType | null>(null);
  userType$ = this.userTypeSubject.asObservable();

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private storage: StorageService) {
    this.initializeSession();
  }

  private initializeSession(): void {
    const session = this.getSession();
    this.isLoggedInSubject.next(!!session);
    this.userTypeSubject.next(this.getUserTypeFromStorage());
    this.userSubject.next(session ? session.user : null);
  }

  private getUserTypeFromStorage(): UserType | null {
    return this.storage.getItem<UserType>(USER_TYPE);
  }

  public setSession(user: User): void {
    const filteredUser: User = {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      phone: user.phone,
      email: user.email,
      password: user.password,
      birthdate: user.birthdate,
      address: {
        street: user.address.street,
        number: user.address.number,
        complement: user.address.complement,
        neighborhood: user.address.neighborhood,
        zipCode: user.address.zipCode,
        city: user.address.city,
        state: user.address.state,
      },
    };
    this.storage.setItem(USER_LOGGED_KEY, { user: filteredUser });
    this.isLoggedInSubject.next(true);
    this.userSubject.next(filteredUser);
  }

  public setUserType(userType: UserType): void {
    this.storage.setItem(USER_TYPE, userType);
    this.userTypeSubject.next(userType);
  }

  public getUser(): User | null {
    const session = this.getSession();
    return session ? session.user : null;
  }

  public getSession(): UserSession | null {
    return this.storage.getItem<UserSession>(USER_LOGGED_KEY);
  }

  public getUserType(): UserType | null {
    return this.storage.getItem<UserType>(USER_TYPE);
  }

  public clearSession(): void {
    this.storage.removeItem(USER_LOGGED_KEY);
    this.storage.removeItem(USER_TYPE);
    this.storage.removeItem(HAS_INITIALIZED_DELETE_ACCOUNT);
    this.isLoggedInSubject.next(false);
    this.userTypeSubject.next(null);
    this.userSubject.next(null);
  }

  public isLoggedIn(): boolean {
    return this.isLoggedInSubject.getValue();
  }

  public setHasInitializedDeleteAccount(value: boolean): void {
    this.storage.setItem(HAS_INITIALIZED_DELETE_ACCOUNT, value);
  }

  public getHasInitializedDeleteAccount(): boolean {
    return (
      this.storage.getItem<boolean>(HAS_INITIALIZED_DELETE_ACCOUNT) ?? false
    );
  }
}
