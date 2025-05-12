import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalUserFormComponent } from './personal-user-form.component';

describe('PersonalUserFormComponent', () => {
  let component: PersonalUserFormComponent;
  let fixture: ComponentFixture<PersonalUserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalUserFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
