import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginProfessionalPage } from './login-professional-page';

describe('LoginProfessionalPage', () => {
  let component: LoginProfessionalPage;
  let fixture: ComponentFixture<LoginProfessionalPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginProfessionalPage],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginProfessionalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
