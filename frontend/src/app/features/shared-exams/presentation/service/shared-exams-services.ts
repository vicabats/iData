import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

interface SharedExamsParams {
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class SharedExamsServices {
  constructor(private http: HttpClient) {}

  public getSharedExamsList({ userId }: SharedExamsParams): Observable<any> {
    const apiUrl = `http://localhost:8080/api/user/${userId}/shared-exams`;

    return this.http.get<any>(apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }
}
