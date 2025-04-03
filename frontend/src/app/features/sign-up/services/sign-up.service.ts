import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PersonalUser } from '../../../shared/types/personal_user';
import { Observable } from 'rxjs';
import { ProfessionalUser } from '../../../shared/types/professional_user';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  constructor(private http: HttpClient) {}

  registerPersonalUser(user: PersonalUser): Observable<any> {
    const apiUrl = 'http://localhost:8080/api/user/login?type=personal';

    return this.http.post<any>(apiUrl, user);
  }

  registerProfessionalUser(user: ProfessionalUser): Observable<any> {
    const apiUrl = 'http://localhost:8080/api/user/login?type=professional';

    return this.http.post<any>(apiUrl, user);
  }
}
