import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterProfessionalContentPage } from './register-professional-content-page';

describe('RegisterProfessionalContentPage', () => {
  let component: RegisterProfessionalContentPage;
  let fixture: ComponentFixture<RegisterProfessionalContentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterProfessionalContentPage],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterProfessionalContentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
