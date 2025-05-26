import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { PersonalUser } from '../../../shared/types/personal_user';
import { Exam } from '../../../shared/types/exams';

interface MyExamsParams {
  user: PersonalUser;
  exam?: Exam;
}

@Injectable({
  providedIn: 'root',
})
export class MyExamsService {
  constructor(private http: HttpClient) {}

  public getExamsList({ user }: MyExamsParams) {
    const apiUrl = `http://localhost:8080/api/user/${user.id}/exams`;

    return this.http.get(apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }

  public uploadExam({ user, exam }: MyExamsParams) {
    const apiUrl = `http://localhost:8080/api/user/${user.id}/exams`;

    const formData = new FormData();
    // formData.append('exam', exam.file, exam.file.name);

    return this.http.post(apiUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }
}
