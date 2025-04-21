import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPersonalContentPage } from './register-personal-content-page';

describe('RegisterPersonalContentPageComponent', () => {
  let component: RegisterPersonalContentPage;
  let fixture: ComponentFixture<RegisterPersonalContentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPersonalContentPage],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPersonalContentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
