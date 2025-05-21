import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../../../shared/components/modal/modal/modal.component';

@Component({
  selector: 'app-terms-and-conditions-modal',
  standalone: true,
  templateUrl: './terms-and-conditions-modal.component.html',
  styleUrls: ['./terms-and-conditions-modal.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    ModalComponent,
  ],
})
export class TermsModalComponent {
  @Input() isOpen = false;
  @Input() termsAccepted = false;
  @Output() close = new EventEmitter<boolean>();

  onCancel(): void {
    this.close.emit(false);
  }

  onAccept(): void {
    this.close.emit(this.termsAccepted);
  }
}
