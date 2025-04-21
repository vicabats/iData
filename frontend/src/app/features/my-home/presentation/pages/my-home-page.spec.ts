import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyHomePage } from './my-home-page';

describe('MyHomePage', () => {
  let component: MyHomePage;
  let fixture: ComponentFixture<MyHomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyHomePage],
    }).compileComponents();

    fixture = TestBed.createComponent(MyHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
