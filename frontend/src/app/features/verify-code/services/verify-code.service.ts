import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../../../shared/types/user';
import { UserType } from '../../../shared/types/user_type';

interface VerifyCodeParams {
  type: UserType;
  cpf: string;
  code: string;
}

@Injectable({
  providedIn: 'root',
})
export class VerifyCodeService {
  constructor(private http: HttpClient) {}

  public verifyCode({ type, cpf, code }: VerifyCodeParams): Observable<User> {
    const apiUrl = `http://localhost:8080/api/user/verify-2fa?type=${type.toString()}`;

    return this.http.post<User>(apiUrl, { cpf, code });
  }
}
