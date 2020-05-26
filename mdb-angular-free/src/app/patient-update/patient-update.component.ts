import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { ProjectServicesService } from 'services/project-services.service';
import { Patient } from '../Patient';

@Component({
  selector: 'app-patient-update',
  templateUrl: './patient-update.component.html',
  styleUrls: ['./patient-update.component.scss']
})
export class PatientUpdateComponent implements OnInit {

  title = "DocsHelp"
  Name = localStorage.getItem('Name');
  Email = localStorage.getItem('Email');
  Phone = localStorage.getItem('Phone');
  Gender = localStorage.getItem('Gender');
  DOB = localStorage.getItem('DOB');
  BloodGroup = localStorage.getItem('BloodGroup');
  Country = localStorage.getItem('Country');
  State = localStorage.getItem('State');
  City = localStorage.getItem('City');
  Adhar= localStorage.getItem('Adhar');
  ID = localStorage.getItem('ID');


  constructor(private fb: FormBuilder,private router:Router,private appComponent:AppComponent,private projectService: ProjectServicesService) { 
    this.appComponent.change(router.url)
  }

  patient: Patient

  get city(){
    return this.updateForm.get('city');
  }
  get state(){
    return this.updateForm.get('state');
  }
  get country(){
    return this.updateForm.get('country');
  }
  get dob(){
    return this.updateForm.get('dob');
  }
  get gender(){
    return this.updateForm.get('gender');
  }
  get name(){
    return this.updateForm.get('name');
  }
  get email(){
    return this.updateForm.get('email');
  }
  get phone(){
    return this.updateForm.get('phone');
  }
  get bgroup(){
    return this.updateForm.get('bgroup');
  }
  get adhar(){
    return this.updateForm.get('adhar');
  }

  get id(){
    return this.updateForm.get('id');
  }

  public stateArray;
  public cityArray;
  populate1(event){
      let countryStateMap = {
        'India': ["select","Jharkhand","Bihar","Uttar pardesh"],
        'Australia' : ["select","Victoria","Queensland"],
        'America' : ["select","Alaska","California","New York"]
      };
    
      let countryCitiesMap = {
        'India' : ["select","Gaya","Patna","Nalanda","Ranchi","Tatanagar","Dhanwad","Banaras","Lucknow","Agra"],
        'Australia' : ["select","Hamilton","Kerang","Swan Hill","Brisbane","Gladstone","Emerald"],
        'America' : ["select","Anchorage","Fairbanks","Vacaville","Sacramento","Abbott Road","Abell Corners"]
      };
      this.stateArray = countryStateMap[event];
      this.cityArray = countryCitiesMap[event];
  };

   populate2(event){
    let stateCitiesMap = {
        'Bihar' : ["select","Gaya","Patna","Nalanda"],
        'Jharkhand' :  ["select","Ranchi","Tatanagar","Dhanwad"],
        'Uttar pardesh' : ["select","Banaras","Lucknow","Agra"],
        'Victoria' : ["select","Hamilton","Kerang","Swan Hill"],
        'Queensland' : ["select","Brisbane","Gladstone","Emerald"],
        'Alaska' : ["select","Anchorage","Fairbanks"],
        'California' : ["select","Vacaville","Sacramento"],
        'New York' : ["select","Abbott Road","Abell Corners"]
    };

    this.cityArray = stateCitiesMap[event];
};


  ngOnInit(): void {
  }

  updateForm = this.fb.group({
    id:[this.ID],
    name:[this.Name, [Validators.required, Validators.minLength(3)]],
    email:[this.Email,[Validators.required, Validators.email]],
    phone:[this.Phone,[Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    gender:[this.Gender, [Validators.required]],
    dob:[this.DOB,[Validators.required]],
    bgroup:[this.BloodGroup,[Validators.required]],
    adhar:[this.Adhar,[Validators.required, Validators.minLength(12),Validators.maxLength(12)]],
    country:[this.Country,[Validators.required]],
    state:[this.State,[Validators.required]],
    city:[this.City,[Validators.required]]
  });

  logout(){
    localStorage.clear();
    this.appComponent.restore("/home")
    this.router.navigate(['/home']);
  }

  onSubmit(){
    console.log(this.updateForm.value);
    // this.projectService.updateDoctor(this.updateForm.value)
    // .subscribe(patient => this.patient = patient);
    // if(this.role=="Student"){
    //   this.updateService.updateStudent(this.updateForm.value)
    //   .subscribe(student => this.student = student);
    //   if(this.student.Middle_Name == ""){
    //     localStorage.setItem('Name',this.student.First_Name +" "+ this.student.Last_Name);
    //   }else{
    //     localStorage.setItem('Name',this.student.First_Name +" "+ this.student.Middle_Name +" "+ this.student.Last_Name);
    //   }
    //     localStorage.setItem('father', this.student.Father_Name);
    //     localStorage.setItem('mother',this.student.Mother_Name);
    //     localStorage.setItem('email', this.student.Email);
    //     localStorage.setItem('phone', this.student.Phone);
    //     localStorage.setItem('adhar',this.student.Adhar);
    //     localStorage.setItem('gender', this.student.Gender);
    //     localStorage.setItem('dob', this.student.DOB);
    //     localStorage.setItem('country', this.student.Country);
    //     localStorage.setItem('state', this.student.State);
    //     localStorage.setItem('city', this.student.City);
    //     localStorage.setItem('ID', this.student.ID);
    //     this.route.navigate(['/profile', 'true']);
    // }
  }

}
