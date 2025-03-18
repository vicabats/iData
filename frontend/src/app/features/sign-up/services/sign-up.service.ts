import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PersonalUser } from '../../../shared/types/personal_user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private apiUrl = '/api/user/register?role=personal';

  constructor(private http: HttpClient) {}

  register(user: PersonalUser): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }
}
