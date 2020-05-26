import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalBookingComponent } from './final-booking.component';

describe('FinalBookingComponent', () => {
  let component: FinalBookingComponent;
  let fixture: ComponentFixture<FinalBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
