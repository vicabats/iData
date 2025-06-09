import { Component, OnInit } from '@angular/core';
import { User } from '../../../../../shared/types/user';
import { UserSessionService } from '../../../../../core/services/user-session/user-session.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedExamsServices } from '../../service/shared-exams-services';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-professional-share-exams-page',
  imports: [LoadingComponent, CommonModule],
  templateUrl: './professional-share-exams-page.html',
  styleUrl: './professional-share-exams-page.css',
})
export class ProfessionalShareExamsPage implements OnInit {
  public user: User | null = null;

  public isLoading = true;

  public sharedExams: any[] = [];

  constructor(
    private userSessionService: UserSessionService,
    private sharedExamsServices: SharedExamsServices,
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

  private handleGetSharedExamsSuccess(response: any): void {
    // Handle the successful response here
    console.log('Shared exams loaded successfully:', response);
    this.isLoading = false;
  }

  private handleGetSharedExamsFailure(errorMessage: string): void {
    // Handle the error response here
    console.error('Failed to load shared exams:', errorMessage);
    this.snackBar.open(errorMessage, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
    this.isLoading = false;
  }
}
