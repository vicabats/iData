import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { PersonalUser } from '../../../shared/types/personal_user';
import { Exam } from '../../../shared/types/exams';

interface MyExamsParams {
  user: PersonalUser;
}

export interface MyExamsResponse {
  exams?: Exam[];
}

@Injectable({
  providedIn: 'root',
})
export class MyExamsService {
  constructor(private http: HttpClient) {}

  public getExamsList({ user }: MyExamsParams): Observable<MyExamsResponse> {
    const apiUrl = `http://localhost:8080/api/user/${user.id}/exams`;

    return this.http.get<MyExamsResponse>(apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }
}
