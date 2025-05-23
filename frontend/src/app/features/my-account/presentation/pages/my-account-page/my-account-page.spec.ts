import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAccountPage } from './my-account-page';

describe('MyAccountPage', () => {
  let component: MyAccountPage;
  let fixture: ComponentFixture<MyAccountPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAccountPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MyAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
