import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePersonalSectionComponent } from './personal-section-component';

describe('ProfilePersonalSectionComponent', () => {
  let component: ProfilePersonalSectionComponent;
  let fixture: ComponentFixture<ProfilePersonalSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePersonalSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePersonalSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
