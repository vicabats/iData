import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserSessionService } from '../../../../../core/services/user-session/user-session.service';
import { SharedExam } from '../../../../../shared/types/shared_exam';
import { getExamTypeName } from '../../../../../shared/types/exam';
import {
  GetSharedExamByIdResponse,
  SharedExamsService,
} from '../../../services/shared-exams-service';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from '../../../../../shared/pipes/capitalize-pipe';

@Component({
  selector: 'app-shared-exam-details-page',
  imports: [LoadingComponent, CommonModule, CapitalizePipe],
  templateUrl: './shared-exam-details-page.html',
  styleUrl: './shared-exam-details-page.css',
})
export class SharedExamDetailsPage implements OnInit {
  public isLoading = true;

  public sharedExam: SharedExam | null = null;
  public sharedExamId: string | undefined;

  private userId: string | undefined = undefined;

  public getExamTypeName = getExamTypeName;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private sharedExamsService: SharedExamsService,
    private userSessionService: UserSessionService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.sharedExamId = params.get('sharedExamId') || '';

      this.userId = history.state.userId;

      console.log('Shared Exam ID:', this.sharedExamId);
      console.log('User ID from history state:', this.userId);

      if (!this.userId) {
        this.userSessionService.user$.subscribe((user) => {
          this.userId = user?.id;
          this.loadSharedExam();
        });
      } else {
        this.loadSharedExam();
      }
    });
  }

  private loadSharedExam(): void {
    if (!this.userId || !this.sharedExamId) {
      this.router.navigate(['shared-exams']);
      return;
    }

    console.log('Loading shared exam with ID:', this.sharedExamId);

    this.sharedExamsService
      .getSharedExamById({
        userId: this.userId,
        sharedExamId: this.sharedExamId,
      })
      .subscribe({
        next: (response) => this.handleGetSharedExamSuccess(response),
        error: (error) => this.handleGetSharedExamFailure(error.message),
      });
  }

  private handleGetSharedExamSuccess(
    response: GetSharedExamByIdResponse
  ): void {
    console.log('Shared exam loaded successfully:', response);
    this.sharedExam = response.sharedExam;
    this.isLoading = false;
  }

  private handleGetSharedExamFailure(errorMessage: string): void {
    this.isLoading = false;
    this.snackBar.open(errorMessage, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
    this.router.navigate(['shared-exams']);
  }

  public goBackToSharedExamsList(): void {
    this.router.navigate(['shared-exams'], {
      state: { userId: this.userId },
    });
  }
}
