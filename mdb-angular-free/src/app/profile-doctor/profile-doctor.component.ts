import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { $ } from 'protractor';
import { Validators, FormBuilder } from '@angular/forms';
import { ProjectServicesService } from 'services/project-services.service';

@Component({
  selector: 'app-profile-doctor',
  templateUrl: './profile-doctor.component.html',
  styleUrls: ['./profile-doctor.component.scss']
})
export class ProfileDoctorComponent implements OnInit {

  title = "DocsHelp";
  Name = localStorage.getItem('Name');
  Email = localStorage.getItem('Email');
  Avail = localStorage.getItem('Availablity');
  ID = localStorage.getItem('ID');
  Phone = localStorage.getItem('Phone');
  Gender = localStorage.getItem('Gender');
  Spec = localStorage.getItem('Specialization');
  Day = localStorage.getItem('Day');
  Shift = localStorage.getItem('Shift');

  constructor(private router:Router,private appComponent:AppComponent,private fb: FormBuilder,private projectService: ProjectServicesService) { 
    //console.log(router.url)
    this.appComponent.change(router.url)
  }

  get shift(){
    return this.availableForm.get('shift');
  }
  
  get patientTime(){
    return this.availableForm.get('patientTime');
  }
  get timeslot(){
    return this.availableForm.get('timeslot');
  }
  get mode(){
    return this.availableForm.get('mode');
  }
  get day(){
    return this.availableForm.get('day');
  }
  get id2(){
    return this.availableForm.get('id2');
  }

  get diseasesName(){
    return this.searchForm.get('diseasesName');
  }

  public timeShift;
  maintainShift(event){
    let timeshiftmap = {
      'Morning': ["10-12 AM", "12-02 PM", "02-04 PM"],
      'Evening':["04-06 PM", "06-08 PM", "08-10 PM"]
    };
    this.timeShift = timeshiftmap[event];
  }

  flag=false;
  appointments;
  length;
  flag2=false;
  ngOnInit(): void {
    this.appointments = JSON.parse(localStorage.getItem('BookedAppointments'));
    if(this.appointments !== ''){
      this.flag2 = true;
      this.length=this.appointments.length;
    }

    if(this.Avail == "False"){
      this.flag=true;
    }
  }

  BackToHome(){
    this.appComponent.restore1("/home");
    this.router.navigate(['/home']);
  }

  logout(){
    localStorage.clear();
    this.appComponent.restore("/home")
    this.router.navigate(['/home']);
  }

  availableForm = this.fb.group({
    id2:[this.ID],
    day:['',[Validators.required]],
    mode:['',[Validators.required]],
    timeslot:['', [Validators.required]],
    patientTime:['', [Validators.required]],
    shift:['',[Validators.required]]
  })
  
  addAvailability(){
    console.log(this.availableForm.value)
    this.projectService.addAvailability(this.availableForm.value)
  }

  searchForm = this.fb.group({
    diseasesName:['']
  });

  searchDisease(){
    // console.log(this.searchForm.value);
    this.projectService.DoctorDiseaseInfo(this.searchForm.value);
  }
}
