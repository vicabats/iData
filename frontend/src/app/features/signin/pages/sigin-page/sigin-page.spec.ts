import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiginPage } from './sigin-page';

describe('SiginPageComponent', () => {
  let component: SiginPage;
  let fixture: ComponentFixture<SiginPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiginPage]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SiginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
