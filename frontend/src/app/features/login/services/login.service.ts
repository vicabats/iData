import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../shared/types/user';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  loginPersonalUser(user: User): Observable<String> {
    const apiUrl = 'http://localhost:8080/api/user/login?type=personal';

    let cpf = user.cpf;
    let password = user.password;

    return this.http.post<String>(apiUrl, { cpf, password });
  }

  loginProfessionalUser(user: User): Observable<String> {
    const apiUrl = 'http://localhost:8080/api/user/login?type=professional';

    let cpf = user.cpf;
    let password = user.password;

    return this.http.post<String>(apiUrl, { cpf, password });
  }
}
