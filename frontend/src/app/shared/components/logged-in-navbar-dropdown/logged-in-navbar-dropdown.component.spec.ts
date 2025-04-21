import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggedInNavbarDropdownComponent } from './logged-in-navbar-dropdown.component';

describe('LoggedInDropdownComponent', () => {
  let component: LoggedInNavbarDropdownComponent;
  let fixture: ComponentFixture<LoggedInNavbarDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggedInNavbarDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoggedInNavbarDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
