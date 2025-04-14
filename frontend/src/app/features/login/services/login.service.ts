import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserType } from '../../../shared/types/user_type';

interface LoginParams {
  type: UserType;
  cpf: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login({ type, cpf, password }: LoginParams): Observable<String> {
    const apiUrl = `http://localhost:8080/api/user/login?type=${type.toString()}`;

    return this.http.post<String>(apiUrl, { cpf, password });
  }
}
