import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { Validators, FormBuilder } from '@angular/forms';
import { ProjectServicesService } from 'services/project-services.service';
import { Doctor } from '../Doctor';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-patient-appointment',
  templateUrl: './patient-appointment.component.html',
  styleUrls: ['./patient-appointment.component.scss']
})
export class PatientAppointmentComponent implements OnInit {

  title = "DocsHelp"
  Name = localStorage.getItem('Name');
  Email = localStorage.getItem('Email');

  constructor(private router:Router,private appComponent:AppComponent,private fb: FormBuilder, private projectService: ProjectServicesService,private route: ActivatedRoute) {
    this.appComponent.change(router.url)
   }

   get specialization(){
    return this.doctorSearchForm.get('specialization');
  }

  ngOnInit() {   }

  doctorSearchForm = this.fb.group({
    specialization:['',[Validators.required, Validators.minLength(3)]]
  });

  logout(){
    localStorage.clear();
    this.appComponent.restore("/home")
    this.router.navigate(['/home']);
  }

  onSubmit(){
    console.log(this.doctorSearchForm.value);
    this.projectService.doctorList(this.doctorSearchForm.value);
    // if(localStorage.getItem('doctors') != ''){
    //   this.router.navigate(['/doctorList']);
    // }
  }

}
