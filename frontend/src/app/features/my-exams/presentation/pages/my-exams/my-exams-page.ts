import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { UserSessionService } from '../../../../../core/services/user-session/user-session.service';
import {
  MyExamsResponse,
  MyExamsService,
} from '../../../services/my-exams-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { User } from '../../../../../shared/types/user';
import { Exam, getExamTypeName } from '../../../../../shared/types/exam';
import { SnackBarComponent } from '../../../../../shared/components/snack-bar/snack-bar.component';
import { CapitalizePipe } from '../../../../../shared/pipes/capitalize-pipe';
import { getExamTypeChipColor } from '../../../../../shared/helpers/get-exam-type-chip-color';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-exams-page',
  imports: [LoadingComponent, CommonModule, CapitalizePipe, FormsModule],
  templateUrl: './my-exams-page.html',
  styleUrl: './my-exams-page.css',
})
export class MyExamsPage implements OnInit {
  public user: User | null = null;

  public isLoading = true;

  public exams: Exam[] = [];

  public getExamTypeName = getExamTypeName;
  public getExamTypeChipColor = getExamTypeChipColor;

  public searchTerm: string = '';

  constructor(
    private userSessionService: UserSessionService,
    private myExamsService: MyExamsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userSessionService.user$.subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.myExamsService.getExamsList({ user: this.user }).subscribe({
          next: (response) => this.handleGetExamsListSuccess(response),
          error: (error) => this.handleGetExamsListFailure(error.message),
        });
      }
    });
  }

  private handleGetExamsListSuccess(response: MyExamsResponse): void {
    this.exams = response.exams ?? [];
    this.isLoading = false;
  }

  private handleGetExamsListFailure(errorMessage: string): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: errorMessage,
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

  public goBackToMyHome(): void {
    this.router.navigate(['my-home']);
  }

  public navigateToExamDetails(exam: Exam): void {
    this.router.navigate(['my-exams', 'exam', exam.id], {
      state: { userId: this.user?.id },
    });
  }

  public navigateToAddExamPage(): void {
    this.router.navigate(['my-exams', 'add']);
  }

  public filteredExams(): Exam[] {
    if (!this.searchTerm?.trim()) {
      return this.exams;
    }
    const term = this.searchTerm.trim().toLowerCase();
    return this.exams.filter(
      (exam) =>
        exam.title.toLowerCase().includes(term) ||
        exam.description?.toLowerCase().includes(term)
    );
  }
}
