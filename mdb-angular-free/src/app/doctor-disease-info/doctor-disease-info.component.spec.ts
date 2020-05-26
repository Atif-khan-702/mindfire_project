import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorDiseaseInfoComponent } from './doctor-disease-info.component';

describe('DoctorDiseaseInfoComponent', () => {
  let component: DoctorDiseaseInfoComponent;
  let fixture: ComponentFixture<DoctorDiseaseInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorDiseaseInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorDiseaseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
