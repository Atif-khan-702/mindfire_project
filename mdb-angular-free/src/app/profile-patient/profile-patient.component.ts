import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { FormBuilder } from '@angular/forms';
import { ProjectServicesService } from 'services/project-services.service';

@Component({
  selector: 'app-profile-patient',
  templateUrl: './profile-patient.component.html',
  styleUrls: ['./profile-patient.component.scss']
})
export class ProfilePatientComponent implements OnInit {

  title = "DocsHelp"
  Name = localStorage.getItem('Name');
  Email = localStorage.getItem('Email');
  ID = localStorage.getItem('ID');
  Phone = localStorage.getItem('Phone');
  Gender = localStorage.getItem('Gender');

  constructor(private router:Router,private appComponent:AppComponent,private route: ActivatedRoute,private fb: FormBuilder,private projectService: ProjectServicesService) { 
    //console.log(router.url)
    this.appComponent.change(router.url)
  }

  get diseasesName(){
    return this.searchForm.get('diseasesName');
  }

  public InfoMessage = '';
  public Appointment;
  appointments;
  length;
  flag1=false;
  flag=false;
  flag2=false;
  ngOnInit() {
    this.appointments = JSON.parse(localStorage.getItem('BookedAppointments'));
    if(this.appointments !== ''){
      this.flag2 = true;
      this.length=this.appointments.length;
    }

    if(this.route.snapshot.paramMap.get('Message')){
      this.InfoMessage= 'Your Appointment Booking is Done, check Your Appointment List';
      this.flag=true;
    }

    if(localStorage.getItem('appointment')){
     this.Appointment = JSON.parse(localStorage.getItem('appointment'));
     this.flag1=true;
     console.log(this.Appointment);
     console.log(this.Appointment['Status'])
    }
  }

  BackToHome(){
    this.appComponent.restore2("/home");
    this.router.navigate(['/home']);
  }

  logout(){
    localStorage.clear();
    this.appComponent.restore("/home")
    this.router.navigate(['/home']);
  }

  searchForm = this.fb.group({
    diseasesName:['']
  });

  searchDisease(){
    console.log(this.searchForm.value);
    this.projectService.PatientDiseaseInfo(this.searchForm.value);
  }


}
