import { Component, OnInit } from '@angular/core';
import { User } from '../../../../shared/types/user';
import { UserSessionService } from '../../../../core/services/user-session/user-session.service';
import { MyExamsService } from '../../services/my-exams-service';
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

  private handleGetExamsListSuccess(response: any): void {
    console.log('Exams list retrieved successfully:', response);
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
      this.router.navigate(['my-account']);
      this.isLoading = false;
    });
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        alert('Por favor, selecione apenas arquivos PDF.');
        return;
      }
      console.log('Arquivo selecionado:', file);
    }
  }
}
