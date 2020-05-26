import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { ProjectServicesService } from 'services/project-services.service';

@Component({
  selector: 'app-doctor-feedback',
  templateUrl: './doctor-feedback.component.html',
  styleUrls: ['./doctor-feedback.component.scss']
})
export class DoctorFeedbackComponent implements OnInit {

  title = "DocsHelp";
  Name = localStorage.getItem('Name');
  Email = localStorage.getItem('Email');
  appointments;

  constructor(private appComponent: AppComponent, private router: Router,private projectService: ProjectServicesService) {
    this.appComponent.change(router.url);
  }

  msg;
  flag=false;
  ngOnInit(): void {
    this.appointments = JSON.parse(localStorage.getItem('BookedAppointments'));
    if(this.appointments !== ''){
      this.msg = "Here is Your Feedbacks";
      this.flag=true;
    }else{
      this.msg = "You have No any Feedbacks";
    }
  }

  logout(){
    localStorage.clear();
    this.appComponent.restore("/home")
    this.router.navigate(['/home']);
  }

}
