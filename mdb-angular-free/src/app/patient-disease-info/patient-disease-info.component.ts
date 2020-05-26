import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ProjectServicesService } from 'services/project-services.service';

@Component({
  selector: 'app-patient-disease-info',
  templateUrl: './patient-disease-info.component.html',
  styleUrls: ['./patient-disease-info.component.scss']
})
export class PatientDiseaseInfoComponent implements OnInit {

  title = "DocsHelp"
  Name = localStorage.getItem('Name');
  Email = localStorage.getItem('Email');
  ID=localStorage.getItem('ID');
  diseaseInfo = JSON.parse(localStorage.getItem('diseaseInfo'));

  constructor(private appComponent: AppComponent, private route:ActivatedRoute, private router: Router, private fb: FormBuilder, private projectService: ProjectServicesService) {
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
