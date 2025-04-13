import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonalUser } from '../../../shared/types/personal_user';
import { ProfessionalUser } from '../../../shared/types/professional_user';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  constructor(private http: HttpClient) {}

  registerPersonalUser(user: PersonalUser): Observable<string> {
    const apiUrl = 'http://localhost:8080/api/user/register?type=personal';

    return this.http.post(apiUrl, user, {
      responseType: 'text',
    });
  }

  registerProfessionalUser(user: ProfessionalUser): Observable<string> {
    const apiUrl = 'http://localhost:8080/api/user/register?type=professional';

    return this.http.post(apiUrl, user, {
      responseType: 'text',
    });
  }

  verify2FACode() {}
}
