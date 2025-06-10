import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { PersonalUser } from '../../../shared/types/personal_user';
import { Exam } from '../../../shared/types/exam';
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
  userId: string;
  exam: Exam;
}

interface DeleteExamParams {
  userId: string;
  examId: string;
}

interface ShareExamParams {
  userId: string;
  examId: string;
  professionalEmail: string;
}

export interface MyExamsResponse {
  exams?: Exam[];
}

export interface GetExamByIdResponse {
  exams: Exam[];
}

export interface UploadExamResponse {
  exam: Exam;
}

export interface UpdateExamResponse {
  exams: Exam;
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

  public uploadExam({
    user,
    exam,
  }: AddExamParams): Observable<UploadExamResponse> {
    const apiUrl = `http://localhost:8080/api/user/${user.id}/exam`;

    const data = {
      type: exam.type.toUpperCase(),
      title: exam.title,
      description: exam.description,
      date: exam.date,
      file: exam.file?.name,
    };

    const formData = new FormData();

    if (exam.file) {
      formData.append('file', exam.file, exam.file.name);
    }
    formData.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );

    return this.http.post<UploadExamResponse>(apiUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }

  public getExamById({ userId, examId }: GetExamById): Observable<Exam> {
    const apiUrl = `http://localhost:8080/api/user/${userId}/exam/${examId}`;

    return this.http.get<{ exams: Exam }>(apiUrl).pipe(
      map((response) => {
        const exam = response.exams;
        return {
          ...exam,
          fileName: typeof exam.file === 'string' ? exam.file : undefined,
          file: undefined,
        };
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }

  public updateExam({
    userId,
    exam,
  }: UpdateExamParams): Observable<UpdateExamResponse> {
    const apiUrl = `http://localhost:8080/api/user/${userId}/exam/${exam.id}`;

    const data = {
      type: exam.type.toUpperCase(),
      title: exam.title,
      description: exam.description,
      date: exam.date,
      file: exam.fileName,
    };

    return this.http.put<UpdateExamResponse>(apiUrl, data).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }

  public deleteExam({ userId, examId }: DeleteExamParams): Observable<void> {
    const apiUrl = `http://localhost:8080/api/user/${userId}/exam/${examId}`;

    return this.http.delete<void>(apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }

  public shareExam({
    userId,
    examId,
    professionalEmail,
  }: ShareExamParams): Observable<void> {
    const apiUrl = `http://localhost:8080/api/user/${userId}/exam/${examId}/share`;

    return this.http.post<void>(apiUrl, { professionalEmail }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }
}
