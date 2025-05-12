import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { PersonalUser } from '../../../../../../shared/types/personal_user';
import { PersonalUserFormComponent } from '../../../../../../shared/components/form-components/personal-user-form/personal-user-form.component';

@Component({
  selector: 'app-register-personal-content-page',
  standalone: true,
  imports: [CommonModule, PersonalUserFormComponent],
  templateUrl: './register-personal-content-page.html',
  styleUrl: './register-personal-content-page.css',
})
export class RegisterPersonalContentPage {
  @Output() submitForm = new EventEmitter<PersonalUser>();

  public onFormSubmit(user: PersonalUser): void {
    this.submitForm.emit(user);
  }
}
