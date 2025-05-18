import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../../../shared/types/user';
import { UserType } from '../../../shared/types/user_type';

interface MyAccountParams {
  type: UserType;
  cpf: string;
  password?: string;
}

export interface MyAccountSuccessResponse {
  message: string;
  data: User;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class MyAccountService {
  constructor(private http: HttpClient) {}

  public getUserInfos({ type, cpf }: MyAccountParams): Observable<User> {
    const apiUrl = `http://localhost:8080/api/user?type=${type.toString()}`;

    const formattedCpf = cpf.replace(/\D/g, '');

    return this.http
      .get<User>(apiUrl, {
        params: { cpf },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error.error);
        })
      );
  }

  public deleteAccount({
    type,
    cpf,
    password,
  }: MyAccountParams): Observable<MyAccountSuccessResponse> {
    const apiUrl = `http://localhost:8080/api/user?type=${type.toString()}`;

    return this.http
      .delete<MyAccountSuccessResponse>(apiUrl, {
        body: {
          cpf,
          password,
        },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error.error);
        })
      );
  }
}
