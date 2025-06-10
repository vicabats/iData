import { Component, OnInit } from '@angular/core';
import { UserSessionService } from '../../../../../core/services/user-session/user-session.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  SharedExamsResponse,
  SharedExamsService,
} from '../../../services/shared-exams-service';
import { User } from '../../../../../shared/types/user';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { CommonModule } from '@angular/common';
import { SharedExam } from '../../../../../shared/types/shared_exam';
import { SnackBarComponent } from '../../../../../shared/components/snack-bar/snack-bar.component';
import { CapitalizePipe } from '../../../../../shared/pipes/capitalize-pipe';
import { getExamTypeName } from '../../../../../shared/types/exam';

@Component({
  selector: 'app-shared-exams-page',
  imports: [LoadingComponent, CommonModule, CapitalizePipe],
  templateUrl: './shared-exams-page.html',
  styleUrl: './shared-exams-page.css',
})
export class SharedExamsPage implements OnInit {
  public user: User | null = null;

  public isLoading = true;

  public sharedExams: SharedExam[] = [];

  public getExamTypeName = getExamTypeName;

  constructor(
    private userSessionService: UserSessionService,
    private sharedExamsServices: SharedExamsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userSessionService.user$.subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.loadSharedExams();
      }
    });
  }

  private loadSharedExams(): void {
    this.sharedExamsServices
      .getSharedExamsList({ userId: this.user?.id as string })
      .subscribe({
        next: (response) => this.handleGetSharedExamsSuccess(response),
        error: (error) => this.handleGetSharedExamsFailure(error.message),
      });
  }

  private handleGetSharedExamsSuccess(response: SharedExamsResponse): void {
    this.sharedExams = response.sharedExams;
    this.isLoading = false;
  }

  private handleGetSharedExamsFailure(errorMessage: string): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: 'Erro ao compartilhar exames carregados com você:',
        errorMessage,
        type: 'error',
      },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'],
    });

    snackBarRef.afterDismissed().subscribe(() => {
      this.router.navigate(['my-home']);
      this.isLoading = false;
    });
  }

  public navigateToExamDetails(sharedExam: SharedExam): void {
    this.router.navigate(['shared-exams', 'shared-exam', sharedExam.exam.id], {
      state: { userId: this.user?.id },
    });
  }
}
