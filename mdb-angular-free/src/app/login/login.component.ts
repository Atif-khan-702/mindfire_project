import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProjectServicesService } from 'services/project-services.service';
import { Patient } from '../Patient';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private loginservice: ProjectServicesService,private router: Router,private route: ActivatedRoute) { }

  error: any;
  patient: Patient;

  get email(){
    return this.loginForm.get('email');
  }
  get password(){
    return this.loginForm.get('password');
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

  loginForm = this.fb.group({
    email:['',[Validators.required, Validators.minLength(3)]],
    password:['',[Validators.required, Validators.minLength(3)]]
  });

  onSubmit(){
    // console.log(this.loginForm.value)
    this.loginservice.loginPatient(this.loginForm.value);
    // this.loginservice.getSpinner();
  }
}
