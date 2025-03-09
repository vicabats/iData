import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInPatientPage } from './sign-in-patient-page';

describe('SignInPatientPage', () => {
  let component: SignInPatientPage;
  let fixture: ComponentFixture<SignInPatientPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInPatientPage]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SignInPatientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
