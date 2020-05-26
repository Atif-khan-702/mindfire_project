import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProjectServicesService } from 'services/project-services.service';
import { Doctor } from '../Doctor';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login-doctor',
  templateUrl: './login-doctor.component.html',
  styleUrls: ['./login-doctor.component.scss']
})
export class LoginDoctorComponent implements OnInit {

  constructor(private fb: FormBuilder, private loginService: ProjectServicesService, private router: Router, private route: ActivatedRoute) { }

  doctor : Doctor;
  error : any;

  get email(){
    return this.DoctorloginForm.get('email');
  }
  get password(){
    return this.DoctorloginForm.get('password');
  }

  public infoMessage = '';
  public errorMessage = '';
  ngOnInit() {
      let msg= this.route.snapshot.paramMap.get('Message');
      if(msg !== undefined &&  msg === 'true') {
          this.infoMessage = 'Registration Successful! Please Login!';
      }else{
        this.errorMessage= msg;
      }
  }

  DoctorloginForm = this.fb.group({
    email:['',[Validators.required, Validators.minLength(3)]],
    password:['',[Validators.required, Validators.minLength(3)]]
  });

  onSubmit(){
    // console.log(this.DoctorloginForm.value)
        this.loginService.loginDoctor(this.DoctorloginForm.value);
      }
}
