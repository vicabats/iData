import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { PersonalUser } from '../../../shared/types/personal_user';
import { Exam } from '../../../shared/types/exams';
import { User } from '../../../shared/types/user';
import { map } from 'rxjs/operators';

interface MyExamsParams {
  user: PersonalUser;
}

interface AddExamParams {
  user: User;
  exam: Exam;
}

interface GetExamById {
  userId: string;
  examId: string;
}

interface UpdateExamParams {
  user: User;
  exam: Exam;
}

interface DeleteExamParams {
  userId: string;
  examId: string;
}

export interface MyExamsResponse {
  exams?: Exam[];
}

export interface GetExamByIdResponse {
  exams: Exam[];
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

  public uploadExam({ user, exam }: AddExamParams): Observable<any> {
    const apiUrl = `http://localhost:8080/api/user/${user.id}/exam`;

    const data = {
      type: exam.type.toUpperCase(),
      title: exam.title,
      description: exam.description,
      date: exam.date,
    };

    const formData = new FormData();
    formData.append('file', exam.file, exam.file.name);
    formData.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );

    return this.http.post(apiUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }

  public getExamById({ userId, examId }: GetExamById): Observable<Exam> {
    const apiUrl = `http://localhost:8080/api/user/${userId}/exam/${examId}`;

    return this.http.get<{ exams: Exam }>(apiUrl).pipe(
      map((response) => response.exams),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }

  public updateExam({ user, exam }: UpdateExamParams): Observable<Exam> {
    const apiUrl = `http://localhost:8080/api/user/${user.id}/exam/${exam.id}`;

    const formData = new FormData();
    if (exam) {
      formData.append('file', exam.file, exam.file.name);
      formData.append('title', exam.title);
      formData.append('description', exam.description);
      formData.append('date', exam.date);
    }

    return this.http.put<Exam>(apiUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }

  public deleteExam({ userId, examId }: DeleteExamParams): Observable<any> {
    const apiUrl = `http://localhost:8080/api/user/${userId}/exam/${examId}`;

    return this.http.delete(apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }
}
