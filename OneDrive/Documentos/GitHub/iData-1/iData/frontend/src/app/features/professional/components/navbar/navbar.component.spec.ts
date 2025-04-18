import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalNavbarComponent } from './navbar.component';

describe('ProfessionalNavbarComponent', () => {
  let component: ProfessionalNavbarComponent;
  let fixture: ComponentFixture<ProfessionalNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionalNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionalNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
