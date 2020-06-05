import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators, FormBuilder} from "@angular/forms";
import { PasswordValidator } from '../shared/password.validator';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { ProjectServicesService } from 'services/project-services.service';
import { Doctor } from '../Doctor';

@Component({
  selector: 'app-doctor-update',
  templateUrl: './doctor-update.component.html',
  styleUrls: ['./doctor-update.component.scss']
})
export class DoctorUpdateComponent implements OnInit {

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
  Specialization = localStorage.getItem('Specialization');
  Experience = localStorage.getItem('Experience');
  Qualification = localStorage.getItem('Qualification');
  ID = localStorage.getItem('ID');
  Shift= localStorage.getItem('Shift');
  Day = localStorage.getItem('Day');
  Mode = localStorage.getItem('Mode');
  TimeSlot = localStorage.getItem('TimeSlot');
  PatientTime = localStorage.getItem('PatientTime');

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router:Router,private appComponent:AppComponent,private projectService: ProjectServicesService) {
    // console.log(this.DOB)
    this.appComponent.change(router.url)
   }

   doctor: Doctor;

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


  //updateForm
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
  get specialization(){
    return this.updateForm.get('specialization');
  }
  get experience(){
    return this.updateForm.get('experience');
  }
  get qualification(){
    return this.updateForm.get('qualification');
  }
  get id1(){
    return this.updateForm.get('id1');
  }

  public timeShift;
  maintainShift(event){
    let timeshiftmap = {
      'Morning': ["10-12 AM", "12-02 PM", "02-04 PM"],
      'Evening':["04-06 PM", "06-08 PM", "08-10 PM"]
    };
    this.timeShift = timeshiftmap[event];
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

  flag = false;
  InfoMessage;
  ngOnInit() {
    if(this.route.snapshot.paramMap.get('Message')){
      this.InfoMessage= 'Record is updated successfully!';
      this.flag=true;
    }
  }

  updateForm = this.fb.group({
    id1:[this.ID],
    name:[this.Name, [Validators.required, Validators.minLength(3)]],
    email:[this.Email,[Validators.required, Validators.email]],
    phone:[this.Phone,[Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    gender:[this.Gender, [Validators.required]],
    dob:[this.DOB,[Validators.required]],
    bgroup:[this.BloodGroup,[Validators.required]],
    adhar:[this.Adhar,[Validators.required, Validators.minLength(12),Validators.maxLength(12)]],
    country:[this.Country,[Validators.required]],
    state:[this.State,[Validators.required]],
    city:[this.City,[Validators.required]],
    specialization:[this.Specialization,[Validators.required]],
    experience:[this.Experience,[Validators.required]],
    qualification:[this.Qualification,[Validators.required]]
    
  });

  availableForm = this.fb.group({
    id2:[this.ID],
    day:[this.Day,[Validators.required]],
    mode:[this.Mode,[Validators.required]],
    timeslot:[this.TimeSlot, [Validators.required]],
    patientTime:[this.PatientTime, [Validators.required]],
    shift:[this.Shift,[Validators.required]]
  })

  logout(){
    localStorage.clear();
    this.appComponent.restore("/home")
    this.router.navigate(['/home']);
  }

  update(){
    //console.log(this.updateForm.value);
    this.projectService.updateDoctor(this.updateForm.value);   
  }

  availability(){
    // console.log(this.availableForm.value)
    this.projectService.updateAvailability(this.availableForm.value)
  }

}
