import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

interface DeleteAccountParams {
  type: string;
  cpf: string;
  code: string;
}

export interface DeleteAccountResponse {
  message: string;
  data: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteAccountService {
  constructor(private http: HttpClient) {}

  public deleteAccount({
    type,
    cpf,
    code,
  }: DeleteAccountParams): Observable<DeleteAccountResponse> {
    const apiUrl = `http://localhost:8080/api/user/confirm-delete?type=${type.toString()}`;

    return this.http.post<DeleteAccountResponse>(apiUrl, { cpf, code }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }
}
