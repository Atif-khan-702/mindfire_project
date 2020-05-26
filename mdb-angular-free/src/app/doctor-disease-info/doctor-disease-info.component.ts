import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ProjectServicesService } from 'services/project-services.service';

@Component({
  selector: 'app-doctor-disease-info',
  templateUrl: './doctor-disease-info.component.html',
  styleUrls: ['./doctor-disease-info.component.scss']
})
export class DoctorDiseaseInfoComponent implements OnInit {

  title = "DocsHelp";
  Name = localStorage.getItem('Name');
  Email = localStorage.getItem('Email');
  diseaseInfo = JSON.parse(localStorage.getItem('diseaseInfo'));

  constructor(private appComponent: AppComponent, private route:ActivatedRoute, private router: Router, private projectService: ProjectServicesService) {
    this.appComponent.change(router.url);
   }

   public errorMessage = '';
  flag=true;
  ngOnInit() {
    let msg= this.route.snapshot.paramMap.get('message');
    if(msg){
      this.errorMessage = msg;
      this.flag=false;
    }
  }

  logout(){
    localStorage.clear();
    this.appComponent.restore("/home")
    this.router.navigate(['/home']);
  }
}
