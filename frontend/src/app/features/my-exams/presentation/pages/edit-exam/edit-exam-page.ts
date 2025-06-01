import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Exam,
  ExamType,
  ExamTypeNames,
  normalizeExamType,
} from '../../../../../shared/types/exams';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserSessionService } from '../../../../../core/services/user-session/user-session.service';
import {
  MyExamsService,
  UpdateExamResponse,
} from '../../../services/my-exams-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../../shared/components/snack-bar/snack-bar.component';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-exam',
  imports: [LoadingComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-exam-page.html',
  styleUrl: './edit-exam-page.css',
})
export class EditExamPage implements OnInit {
  public editExamForm: FormGroup = new FormGroup({});
  public isLoading = true;

  public exam: Exam | null = null;

  public examId: string | undefined;
  private userId: string | undefined = undefined;

  public examTypes = Object.values(ExamType);
  public examTypeNames = ExamTypeNames;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private myExamsService: MyExamsService,
    private userSessionService: UserSessionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.examId = params.get('examId') || '';
      this.userId = history.state.userId;
      this.exam = history.state.exam;

      if (!this.userId) {
        this.userSessionService.user$.subscribe((user) => {
          this.userId = user?.id;
          this.initForm();
        });
      } else {
        this.initForm();
      }
    });
  }

  private initForm(): void {
    if (!this.exam) {
      this.snackBar.openFromComponent(SnackBarComponent, {
        data: {
          message: 'Exame não encontrado para edição.',
          type: 'error',
        },
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar'],
      });
      this.router.navigate(['/my-exams']);
      return;
    }

    const normalizedType = normalizeExamType(this.exam.type);

    this.editExamForm = this.formBuilder.group({
      type: [normalizedType, Validators.required],
      title: [this.exam.title, Validators.required],
      description: [this.exam.description, Validators.required],
      date: [this.exam.date?.substring(0, 10), Validators.required],
      file: [{ value: this.exam.file, disabled: true }],
    });

    this.isLoading = false;
  }

  public goBackToViewExam(): void {
    if (this.examId && this.userId) {
      this.router.navigate(['my-exams', 'exam', this.examId], {
        state: { userId: this.userId },
      });
    }
  }

  private base64ToFile(
    base64: string,
    fileName: string,
    mimeType = 'application/pdf'
  ): File {
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new File([ab], fileName, { type: mimeType });
  }

  public onEditSubmit(): void {
    if (this.editExamForm.invalid || !this.exam || !this.userId) return;

    this.isLoading = true;
    const formValue = this.editExamForm.value;

    let dateString = formValue.date;
    if (dateString && dateString.length === 10) {
      dateString = dateString + 'T00:00:00';
    }

    if (
      this.exam &&
      (!this.exam.file || !(this.exam.file instanceof File)) &&
      this.exam.fileContent &&
      this.exam.fileName
    ) {
      this.exam.file = this.base64ToFile(
        this.exam.fileContent,
        this.exam.fileName
      );
    }

    const examToUpdate: Exam = {
      ...this.exam,
      type: formValue.type as ExamType,
      title: formValue.title,
      description: formValue.description,
      date: dateString,
      file: this.exam.file!,
    };

    this.myExamsService
      .updateExam({ userId: this.userId, exam: examToUpdate })
      .subscribe({
        next: (updatedExam) => this.handleUpdateExamSuccess(updatedExam),
        error: (_) => this.handleUpdateExamFailure(),
      });
  }

  private handleUpdateExamSuccess(updatedExam: UpdateExamResponse): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: 'Exame atualizado com sucesso!',
        type: 'success',
      },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar'],
    });

    snackBarRef.afterDismissed().subscribe(() => {
      console.log(updatedExam);
      const examId = updatedExam.exams.id;
      this.isLoading = false;
      this.router.navigate(['my-exams', 'exam', examId], {
        state: { userId: this.userId },
      });
    });
  }

  private handleUpdateExamFailure(): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: 'Erro ao atualizar exame. Por favor, tente novamente.',
        type: 'error',
      },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'],
    });

    this.isLoading = false;
  }
}
