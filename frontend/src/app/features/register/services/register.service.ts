import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { PersonalUser } from '../../../shared/types/personal_user';
import { ProfessionalUser } from '../../../shared/types/professional_user';
import { UserType } from '../../../shared/types/user_type';

interface RegisterParams {
  type: UserType;
  user: PersonalUser | ProfessionalUser;
}

interface RegisterSuccessResponse {
  message: string;
  data: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  public register({
    type,
    user,
  }: RegisterParams): Observable<RegisterSuccessResponse> {
    const apiUrl = `http://localhost:8080/api/user/register?type=${type.toString()}`;

    return this.http.post<RegisterSuccessResponse>(apiUrl, user).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }
}
