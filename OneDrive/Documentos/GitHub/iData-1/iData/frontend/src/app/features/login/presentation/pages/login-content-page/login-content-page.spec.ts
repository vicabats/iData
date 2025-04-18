import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginContentPage } from './login-content-page';

describe('LoginContentPage', () => {
  let component: LoginContentPage;
  let fixture: ComponentFixture<LoginContentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginContentPage],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginContentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
