import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonalUser } from '../../../shared/types/personal_user';
import { ProfessionalUser } from '../../../shared/types/professional_user';
import { UserType } from '../../../shared/types/user_type';

interface RegisterParams {
  type: UserType;
  user: PersonalUser | ProfessionalUser;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  public register({ type, user }: RegisterParams): Observable<String> {
    const apiUrl = `http://localhost:8080/api/user/register?type=${type.toString()}`;

    return this.http.post<String>(apiUrl, user);
  }
}
