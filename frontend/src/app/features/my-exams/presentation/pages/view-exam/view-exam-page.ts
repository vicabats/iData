import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { CommonModule } from '@angular/common';
import { Exam, getExamTypeName } from '../../../../../shared/types/exam';
import { MyExamsService } from '../../../services/my-exams-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../../shared/components/snack-bar/snack-bar.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal/modal.component';
import { UserSessionService } from '../../../../../core/services/user-session/user-session.service';
import { CapitalizePipe } from '../../../../../shared/pipes/capitalize-pipe';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-exam',
  imports: [
    LoadingComponent,
    CommonModule,
    ModalComponent,
    CapitalizePipe,
    PdfViewerModule,
    FormsModule,
  ],
  templateUrl: './view-exam-page.html',
  styleUrl: './view-exam-page.css',
})
export class ViewExamPage implements OnInit {
  public isLoading = true;

  public exam: Exam | null = null;

  public examId: string | undefined;
  private userId: string | undefined = undefined;

  public getExamTypeName = getExamTypeName;

  public showConfirmDeleteExamModal = false;

  public showShareExamModal = false;
  public professionalEmailToShare: string = '';
  public isSharingExam = false;

  constructor(
    private myExamsService: MyExamsService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private userSessionService: UserSessionService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.examId = params.get('examId') || '';

      this.userId = history.state.userId;

      if (!this.userId) {
        this.userSessionService.user$.subscribe((user) => {
          this.userId = user?.id;
          this.loadExam();
        });
      } else {
        this.loadExam();
      }
    });
  }

  private loadExam(): void {
    if (!this.userId || !this.examId) {
      this.router.navigate(['my-exams']);
      return;
    }

    this.myExamsService
      .getExamById({
        userId: this.userId,
        examId: this.examId,
      })
      .subscribe({
        next: (exam) => this.handleGetExamSuccess(exam),
        error: (error) => this.handleGetExamFailure(error.message),
      });
  }

  private handleGetExamSuccess(exam: Exam): void {
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

  public goBackToList(): void {
    this.router.navigate(['my-exams']);
  }

  public navigateToEditExam(): void {
    if (this.examId && this.userId && this.exam) {
      this.router.navigate(['my-exams', 'exam', this.examId, 'edit'], {
        state: { userId: this.userId, exam: this.exam },
      });
    }
  }

  public openDeleteExamModal(): void {
    this.showConfirmDeleteExamModal = true;
  }

  public closeDeleteExamModal(): void {
    this.showConfirmDeleteExamModal = false;
  }

  public confirmDeleteExam(): void {
    this.showConfirmDeleteExamModal = false;
    this.isLoading = true;

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

  public openShareExamModal(): void {
    this.showShareExamModal = true;
  }

  public closeShareExamModal(): void {
    this.showShareExamModal = false;
  }

  public isShareEmailValid(): boolean {
    return (
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.professionalEmailToShare) &&
      !this.isSharingExam
    );
  }

  public confirmShareExam(): void {
    if (!this.professionalEmailToShare) return;
    this.isSharingExam = true;

    this.myExamsService
      .shareExam({
        userId: this.userId as string,
        examId: this.examId as string,
        professionalEmail: this.professionalEmailToShare,
      })
      .subscribe({
        next: (response) => this.handleShareExamSuccess(response),
        error: (error) => this.handleShareExamFailure(error),
      });
  }

  private handleShareExamSuccess(response: any): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: 'Exame compartilhado com sucesso!',
        type: 'success',
      },
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['success-snackbar', 'centered-snackbar'],
    });

    snackBarRef.afterDismissed().subscribe(() => {
      this.showShareExamModal = false;
      this.professionalEmailToShare = '';
      this.isSharingExam = false;
    });
  }

  private handleShareExamFailure(error: any): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: 'Erro ao compartilhar o exame: ' + error.message,
        type: 'error',
      },
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['error-snackbar', 'centered-snackbar'],
    });

    snackBarRef.afterDismissed().subscribe(() => {
      this.professionalEmailToShare = '';
      this.isSharingExam = false;
    });
  }
}
