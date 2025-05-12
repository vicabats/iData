import { Component, EventEmitter, Output } from '@angular/core';
import { ProfessionalUser } from '../../../../../../shared/types/professional_user';
import { FormGroup } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { ProfessionalUserFormComponent } from '../../../../../../shared/components/form-components/professional-user-form/professional-user-form.component';

@Component({
  selector: 'app-register-professional-content-page',
  imports: [CommonModule, ProfessionalUserFormComponent],
  templateUrl: './register-professional-content-page.html',
  styleUrl: './register-professional-content-page.css',
})
export class RegisterProfessionalContentPage {
  @Output() submitForm = new EventEmitter<ProfessionalUser>();

  public professionalForm: FormGroup = new FormGroup({});

  public onFormSubmit(user: ProfessionalUser): void {
    this.submitForm.emit(user);
  }
}
