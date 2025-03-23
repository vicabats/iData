import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PersonalUser } from '../../../shared/types/personal_user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private apiUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) {}

  register(user: PersonalUser): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }
}
