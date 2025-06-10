import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { SharedExam } from '../../../shared/types/shared_exam';

interface SharedExamsParams {
  userId: string;
}

export interface SharedExamsResponse {
  sharedExams: SharedExam[];
}

interface GetSharedExamByIdParams {
  userId: string;
  sharedExamId: string;
}

export interface GetSharedExamByIdResponse {
  sharedExam: SharedExam;
}

@Injectable({
  providedIn: 'root',
})
export class SharedExamsService {
  constructor(private http: HttpClient) {}

  public getSharedExamsList({
    userId,
  }: SharedExamsParams): Observable<SharedExamsResponse> {
    const apiUrl = `http://localhost:8080/api/user/${userId}/shared-exams`;

    return this.http.get<SharedExamsResponse>(apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }

  public getSharedExamById({
    userId,
    sharedExamId,
  }: GetSharedExamByIdParams): Observable<GetSharedExamByIdResponse> {
    const apiUrl = `http://localhost:8080/api/user/${userId}/shared-exams/${sharedExamId}`;

    return this.http.get<GetSharedExamByIdResponse>(apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }
}
