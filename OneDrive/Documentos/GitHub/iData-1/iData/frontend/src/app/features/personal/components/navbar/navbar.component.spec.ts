import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalNavbarComponent } from './navbar.component';

describe('PersonalNavbarComponent', () => {
  let component: PersonalNavbarComponent;
  let fixture: ComponentFixture<PersonalNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
