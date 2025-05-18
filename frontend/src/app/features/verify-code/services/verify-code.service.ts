import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User } from '../../../shared/types/user';
import { UserType } from '../../../shared/types/user_type';

interface VerifyCodeParams {
  type: UserType;
  cpf: string;
  code: string;
}

export interface VerifyCodeApiResponse {
  data: User;
  message: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class VerifyCodeService {
  constructor(private http: HttpClient) {}

  public verifyCode({
    type,
    cpf,
    code,
  }: VerifyCodeParams): Observable<VerifyCodeApiResponse> {
    const apiUrl = `http://localhost:8080/api/user/verify-2fa?type=${type.toString()}`;

    return this.http.post<VerifyCodeApiResponse>(apiUrl, { cpf, code }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }
}
