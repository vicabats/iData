import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalPage } from './personal-page';

describe('PersonalPage', () => {
  let component: PersonalPage;
  let fixture: ComponentFixture<PersonalPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
