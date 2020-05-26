import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.scss']
})
export class PatientInfoComponent implements OnInit {

  title = "DocsHelp";
  Name = localStorage.getItem('Name');
  Email = localStorage.getItem('Email');
  ID = localStorage.getItem('ID');
  Phone = localStorage.getItem('Phone');
  Gender = localStorage.getItem('Gender');
  BloodGroup = localStorage.getItem('BloodGroup');
  Adhar = localStorage.getItem('Adhar');
  Country = localStorage.getItem('Country');
  State = localStorage.getItem('State');
  City = localStorage.getItem('City');
  DOB = localStorage.getItem('DOB');

  constructor(private appComponent: AppComponent, private router: Router) {
    this.appComponent.change(router.url);
   }

  ngOnInit(): void {
  }

  logout(){
    localStorage.clear();
    this.appComponent.restore("/home")
    this.router.navigate(['/home']);
  }

}
