import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Exam,
  ExamType,
  ExamTypeNames,
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
  UploadExamResponse,
} from '../../../services/my-exams-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../../../../shared/types/user';
import { SnackBarComponent } from '../../../../../shared/components/snack-bar/snack-bar.component';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-exams-page',
  imports: [LoadingComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-exams-page.html',
  styleUrl: './add-exams-page.css',
})
export class AddExamsPage implements OnInit {
  public addExamForm: FormGroup = new FormGroup({});

  public isLoading = false;

  public examTypes = Object.values(ExamType);
  public examTypeNames = ExamTypeNames;

  public user: User | null = null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private myExamsService: MyExamsService,
    private userSessionService: UserSessionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userSessionService.user$.subscribe((user) => {
      this.user = user;
    });
    this.initializeVerifyCodeForm();
  }

  private initializeVerifyCodeForm(): void {
    this.addExamForm = this.formBuilder.group({
      type: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      file: [null, Validators.required],
    });
  }

  public onClearFile(): void {
    this.addExamForm.get('file')?.setValue(null);
    this.addExamForm.get('file')?.markAsUntouched();
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.type !== 'application/pdf') {
        alert('Por favor, selecione apenas arquivos PDF.');
        this.addExamForm.get('file')?.setValue(null);
        return;
      }

      if (file.size > 1024 * 1024) {
        alert('O arquivo deve ter no máximo 1MB.');
        this.addExamForm.get('file')?.setValue(null);
        return;
      }

      this.addExamForm.get('file')?.setValue(file);
      this.addExamForm.get('file')?.markAsTouched();
    }
  }

  public onSubmit(): void {
    if (this.addExamForm.invalid) return;

    this.isLoading = true;

    const formValue = this.addExamForm.value;

    let dateString = formValue.date;
    if (dateString && dateString.length === 10) {
      dateString = dateString + 'T00:00:00';
    }

    const examToSend: Exam = {
      type: formValue.type as ExamType,
      title: formValue.title,
      description: formValue.description,
      date: dateString,
      file: formValue.file as File,
    };

    this.myExamsService
      .uploadExam({
        user: this.user as User,
        exam: examToSend,
      })
      .subscribe({
        next: (response) => this.handleUploadExamSuccess(response),
        error: (error) => this.handleUploadExamFailure(error),
      });
  }

  private handleUploadExamSuccess(response: UploadExamResponse): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: 'Exame adicionado com sucesso!',
        type: 'success',
      },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar'],
    });

    snackBarRef.afterDismissed().subscribe(() => {
      console.log(response);
      this.isLoading = false;
      this.addExamForm.reset();
      this.router.navigate(['/my-exams']);
    });
  }

  private handleUploadExamFailure(error: any): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: 'Erro ao adicionar exame. Por favor, tente novamente.',
        type: 'error',
      },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'],
    });

    snackBarRef.afterDismissed().subscribe(() => {
      this.isLoading = false;
      this.addExamForm.reset();
      console.error('Erro ao adicionar exame:', error);
    });
  }
}
