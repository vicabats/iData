import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpProfessionalPage } from './sign-up-professional-page';

describe('SignUpProfessionalPage', () => {
  let component: SignUpProfessionalPage;
  let fixture: ComponentFixture<SignUpProfessionalPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpProfessionalPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpProfessionalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
