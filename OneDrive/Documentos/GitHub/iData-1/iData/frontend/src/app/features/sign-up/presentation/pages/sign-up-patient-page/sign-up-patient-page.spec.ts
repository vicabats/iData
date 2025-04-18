import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpPatientPage } from './sign-up-patient-page';

describe('SignUpPatientPage', () => {
  let component: SignUpPatientPage;
  let fixture: ComponentFixture<SignUpPatientPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpPatientPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpPatientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
