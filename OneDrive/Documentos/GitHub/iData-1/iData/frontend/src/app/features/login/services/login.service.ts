import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { UserType } from '../../../shared/types/user_type';

interface LoginParams {
  type: UserType;
  cpf: string;
  password: string;
}

interface LoginErrorResponse {
  message: string;
  errorCode: string;
  timestamp: string;
}

interface LoginSuccessResponse {
  message: string;
  data: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login({
    type,
    cpf,
    password,
  }: LoginParams): Observable<LoginSuccessResponse> {
    const apiUrl = `http://localhost:8080/api/user/login?type=${type.toString()}`;

    return this.http.post<LoginSuccessResponse>(apiUrl, { cpf, password }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }
}
