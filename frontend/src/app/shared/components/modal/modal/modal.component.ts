import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() ctaText: string | null = null;
  @Output() ctaAction = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onCtaClick(): void {
    this.ctaAction.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}
