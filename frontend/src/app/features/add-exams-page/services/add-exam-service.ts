import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { PersonalUser } from '../../../shared/types/personal_user';
import { Exam } from '../../../shared/types/exams';
import { User } from '../../../shared/types/user';

interface AddExamParams {
  user: User;
  exam: Exam;
}

// export interface MyExamsResponse {
//   exams?: Exam[];
// }

@Injectable({
  providedIn: 'root',
})
export class AddExamService {
  constructor(private http: HttpClient) {}

  public uploadExam({ user, exam }: AddExamParams): Observable<any> {
    const apiUrl = `http://localhost:8080/api/user/${user.id}/exams`;

    const formData = new FormData();
    if (exam) {
      formData.append('file', exam.file, exam.file.name);
      formData.append('type', exam.type);
      formData.append('title', exam.title);
      formData.append('description', exam.description);
      formData.append('date', exam.date);
    }

    return this.http.post(apiUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }
}
