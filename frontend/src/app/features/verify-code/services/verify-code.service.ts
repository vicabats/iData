import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../../../shared/types/user';

interface VerifyCodeParams {
  type: string;
  cpf: string;
  code: string;
}

@Injectable({
  providedIn: 'root',
})
export class VerifyCodeService {
  constructor(private http: HttpClient) {}

  public verifyCode({ type, cpf, code }: VerifyCodeParams): Observable<any> {
    const apiUrl = `http://localhost:8080/api/user/verify-2fa?type=${type}`;
    const email = 'batistoti.v@gmail.com';

    return this.http.post<User>(apiUrl, { email, code }).pipe(
      catchError((error) => {
        const errorMessage =
          error.error || 'Erro desconhecido ao verificar o código';
        return throwError(() => errorMessage);
      })
    );
  }
}
