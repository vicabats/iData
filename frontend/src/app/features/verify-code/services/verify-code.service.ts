import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User } from '../../../shared/types/user';
import { UserType } from '../../../shared/types/user_type';

interface VerifyCodeParams {
  type: UserType;
  cpf: string;
  code: string;
}

interface VerifyCodeApiResponse {
  data: User;
  message: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class VerifyCodeService {
  constructor(private http: HttpClient) {}

  public verifyCode({ type, cpf, code }: VerifyCodeParams): Observable<User> {
    const apiUrl = `http://localhost:8080/api/user/verify-2fa?type=${type.toString()}`;

    return this.http.post<VerifyCodeApiResponse>(apiUrl, { cpf, code }).pipe(
      map((response) => response.data),
      catchError((error) => {
        return throwError(() => error?.error?.message || 'Erro inesperado.');
      })
    );
  }
}
