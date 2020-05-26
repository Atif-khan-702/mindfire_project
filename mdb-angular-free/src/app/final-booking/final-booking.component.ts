import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';
import { ProjectServicesService } from 'services/project-services.service';

@Component({
  selector: 'app-final-booking',
  templateUrl: './final-booking.component.html',
  styleUrls: ['./final-booking.component.scss']
})
export class FinalBookingComponent implements OnInit {

  title = "DocsHelp"
  Name = localStorage.getItem('Name');
  Email = localStorage.getItem('Email');
  Phone = localStorage.getItem('Phone');
  PatientId = localStorage.getItem('ID');
  DoctorId = localStorage.getItem('DoctorID');
  DoctorName = localStorage.getItem('DoctorName');
  DoctorShift = localStorage.getItem('DoctorShift');
  Qualification = localStorage.getItem('Qualification');
  Experience = localStorage.getItem('Experience');
  Specialization = localStorage.getItem('Specialization');

  constructor(private appComponent: AppComponent, private router:Router,private fb:FormBuilder, private projectService: ProjectServicesService, private route: ActivatedRoute) {
    this.appComponent.change(router.url);
   }

  get patient(){
    return this.bookingForm.get('patient');
  }
  get name(){
    return this.bookingForm.get('name');
  }
  get email(){
    return this.bookingForm.get('email');
  }
  get phone(){
    return this.bookingForm.get('phone');
  }

  // public infoMessage = '';
  public errorMessage = '';
  flag=false;
  ngOnInit() {
    if(this.route.snapshot.paramMap.get('Message')){
      let msg= this.route.snapshot.paramMap.get('Message');
      this.errorMessage= msg;
      this.flag=true;
    }
  }

  bookingForm = this.fb.group({
    patient:[this.Name],
    patientId:[this.PatientId],
    doctorId:[this.DoctorId],
    name:[this.Name,[Validators.required]],
    email:[this.Email,[Validators.required, Validators.email]],
    phone:[this.Phone, [Validators.required,Validators.minLength(10), Validators.maxLength(10)]]
  })

  
  logout(){
    localStorage.clear();
    this.appComponent.restore("/home")
    this.router.navigate(['/home']);
  }

  appointment(){
    console.log(this.bookingForm.value);
    this.projectService.appointment(this.bookingForm.value);
  }
}
