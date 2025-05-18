import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../../shared/types/user';
import { catchError, Observable, throwError } from 'rxjs';

interface EditAccountParams {
  type: string;
  user: User;
}

export interface EditAccountSuccessResponse {
  message: string;
  data: User;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class EditAccountService {
  constructor(private http: HttpClient) {}

  public editAccount({
    type,
    user,
  }: EditAccountParams): Observable<EditAccountSuccessResponse> {
    const apiUrl = `http://localhost:8080/api/user?type=${type.toString()}`;

    return this.http.put<EditAccountSuccessResponse>(apiUrl, user).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }
}
