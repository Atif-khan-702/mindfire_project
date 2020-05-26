import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-patient-appointment-list',
  templateUrl: './patient-appointment-list.component.html',
  styleUrls: ['./patient-appointment-list.component.scss']
})
export class PatientAppointmentListComponent implements OnInit {

  title = "DocsHelp"
  Name = localStorage.getItem('Name');
  Email = localStorage.getItem('Email');
  ID = localStorage.getItem('ID');
  Phone = localStorage.getItem('Phone');
  Gender = localStorage.getItem('Gender');
  appointments;

  constructor(private router:Router,private appComponent:AppComponent,private route: ActivatedRoute, private fb: FormBuilder) { 
    //console.log(router.url)
    this.appComponent.change(router.url)
  }

  get feedback(){
    return this.feedbackForm.get('feedback');
  }
  msg;
  Appointment;
  flag1=false;
  flag=false;
  ngOnInit(): void {
    this.appointments = JSON.parse(localStorage.getItem('BookedAppointments'));
    console.log(this.appointments);
    if(this.appointments !== ''){
      this.msg = "Here is Your Booked Appointments List";
      this.flag=true;
    }else{
      this.msg = "You have No any Booked Appointments";
    }

    if(localStorage.getItem('appointment')){
      this.Appointment = JSON.parse(localStorage.getItem('appointment'));
      this.flag1=true;
     }

  }

  logout(){
    localStorage.clear();
    this.appComponent.restore("/home")
    this.router.navigate(['/home']);
  }

  feedbackForm = this.fb.group({
    feedback:['',[Validators.required, Validators.minLength(3)]]
  });

  onSubmit(){
    console.log(this.feedbackForm.value);
  }
}
