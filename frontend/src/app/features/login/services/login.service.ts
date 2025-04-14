import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface LoginParams {
  type: string;
  cpf: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login({ type, cpf, password }: LoginParams): Observable<string> {
    const apiUrl = `http://localhost:8080/api/user/login?type=${type}`;

    return this.http.post(apiUrl, { cpf, password }, { responseType: 'text' });
  }
}
