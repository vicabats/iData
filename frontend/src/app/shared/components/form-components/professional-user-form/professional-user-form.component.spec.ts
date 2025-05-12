import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalUserFormComponent } from './professional-user-form.component';

describe('ProfessionalUserFormComponent', () => {
  let component: ProfessionalUserFormComponent;
  let fixture: ComponentFixture<ProfessionalUserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionalUserFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionalUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
