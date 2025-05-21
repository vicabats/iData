import { Injectable } from '@angular/core';
import { User } from '../../../shared/types/user';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

interface UpdatePasswordParams {
  type: string;
  newPassword: string;
  user: User;
}

export interface UpdatePasswordSuccessResponse {
  message: string;
  data: User;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class UpdatePasswordService {
  constructor(private http: HttpClient) {}

  public updatePassword({
    type,
    newPassword,
    user,
  }: UpdatePasswordParams): Observable<UpdatePasswordSuccessResponse> {
    const setUserWithNewPassword: User = {
      ...user,
      password: newPassword,
    };

    const apiUrl = `http://localhost:8080/api/user?type=${type.toString()}`;

    return this.http
      .put<UpdatePasswordSuccessResponse>(apiUrl, setUserWithNewPassword)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error.error);
        })
      );
  }
}
