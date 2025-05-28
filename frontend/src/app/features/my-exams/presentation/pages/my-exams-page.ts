import { Component, OnInit } from '@angular/core';
import { User } from '../../../../shared/types/user';
import { UserSessionService } from '../../../../core/services/user-session/user-session.service';
import {
  MyExamsResponse,
  MyExamsService,
} from '../../services/my-exams-service';
import { Router } from '@angular/router';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../shared/components/snack-bar/snack-bar.component';
import { Exam } from '../../../../shared/types/exams';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-exams-page',
  imports: [LoadingComponent, CommonModule],
  templateUrl: './my-exams-page.html',
  styleUrl: './my-exams-page.css',
})
export class MyExamsPage implements OnInit {
  public user: User | null = null;

  public isLoading = true;

  public exams: Exam[] = [];

  constructor(
    private userSessionService: UserSessionService,
    private myExamsService: MyExamsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userSessionService.user$.subscribe((user) => {
      this.user = user;
    });
    this.myExamsService.getExamsList({ user: this.user as User }).subscribe({
      next: (response) => this.handleGetExamsListSuccess(response),
      error: (error) => this.handleGetExamsListFailure(error.message),
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

  public navigateToAddExamPage(): void {
    this.router.navigate(['my-exams', 'add']);
  }
}
