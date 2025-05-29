import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { CommonModule } from '@angular/common';
import { Exam } from '../../../../../shared/types/exams';
import { MyExamsService } from '../../../services/my-exams-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../../shared/components/snack-bar/snack-bar.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal/modal.component';

@Component({
  selector: 'app-view-exam',
  imports: [LoadingComponent, CommonModule, ModalComponent],
  templateUrl: './view-exam-page.html',
  styleUrl: './view-exam-page.css',
})
export class ViewExamPage implements OnInit {
  public isLoading = true;

  public exam: Exam | null = null;

  public examId: string | undefined;
  private userId: string | undefined = undefined;

  public showConfirmDeleteExamModal = false;

  constructor(
    private myExamsService: MyExamsService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.examId = params.get('examId') || '';

      this.route.queryParams.subscribe((query) => {
        this.userId = query['userId'];

        this.myExamsService
          .getExamById({
            userId: this.userId as string,
            examId: this.examId as string,
          })
          .subscribe({
            next: (exam) => this.handleGetExamSuccess(exam),
            error: (error) => this.handleGetExamFailure(error.message),
          });
      });
    });
  }

  private handleGetExamSuccess(exam: Exam): void {
    if (exam.date) {
      const dateObj = new Date(exam.date);
      exam.date = dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    this.exam = exam;
    this.isLoading = false;
  }

  private handleGetExamFailure(errorMessage: string): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: 'Erro ao carregar o exame: ' + errorMessage,
        type: 'error',
      },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'],
    });

    snackBarRef.afterDismissed().subscribe(() => {
      this.router.navigate(['my-exams']);
      this.isLoading = false;
    });
  }

  public editExam(): void {
    if (this.examId && this.userId) {
      this.router.navigate(['my-exams', 'exam', this.examId, 'edit'], {
        queryParams: { userId: this.userId },
      });
    }
  }

  public deleteExam(): void {
    this.showConfirmDeleteExamModal = true;
  }

  public closeModal(): void {
    this.showConfirmDeleteExamModal = false;
  }

  public confirmDeleteExam(): void {
    if (this.examId && this.userId) {
      this.myExamsService
        .deleteExam({
          userId: this.userId,
          examId: this.examId,
        })
        .subscribe({
          next: (_) => this.handleDeleteExamSuccess(),
          error: (error) => this.handleDeleteExamFailure(error.message),
        });
    }
  }

  private handleDeleteExamSuccess(): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: 'Exame deletado com sucesso!',
        type: 'success',
      },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar'],
    });

    snackBarRef.afterDismissed().subscribe(() => {
      this.router.navigate(['my-exams']);
      this.isLoading = false;
    });
  }

  private handleDeleteExamFailure(errorMessage: string): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: 'Erro ao deletar o exame: ' + errorMessage,
        type: 'error',
      },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'],
    });

    snackBarRef.afterDismissed().subscribe(() => {
      this.isLoading = false;
    });
  }
}
