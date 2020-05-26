import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { Appointment } from 'src/Appointment';
import { ProjectServicesService } from 'services/project-services.service';

@Component({
  selector: 'app-doctor-appointment-list',
  templateUrl: './doctor-appointment-list.component.html',
  styleUrls: ['./doctor-appointment-list.component.scss']
})
export class DoctorAppointmentListComponent implements OnInit {

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
    // console.log(this.appointments);
    if(this.appointments !== ''){
      this.msg = "Here is Your Appointments List";
      this.flag=true;
    }else{
      this.msg = "You have No any Appointments";
    }
  }

  logout(){
    localStorage.clear();
    this.appComponent.restore("/home")
    this.router.navigate(['/home']);
  }

  served(appointment){
    console.log(appointment)
    this.projectService.servedAppointment(appointment);
  }


}
