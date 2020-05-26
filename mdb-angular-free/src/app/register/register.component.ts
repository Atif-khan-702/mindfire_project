import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PasswordValidator } from '../shared/password.validator';
import { ProjectServicesService } from 'services/project-services.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder, private _signup: ProjectServicesService) { }

  get fname(){
    return this.signupForm.get('fname');
  }
  get lname(){
    return this.signupForm.get('lname');
  }
  get password(){
    return this.signupForm.get('password');
  }
  get cnf_pass(){
    return this.signupForm.get('cnf_pass');
  }
  get email(){
    return this.signupForm.get('email');
  }
  get phone(){
    return this.signupForm.get('phone');
  }
  get adhar(){
    return this.signupForm.get('adhar');
  }

  ngOnInit(): void {
  }

  signupForm = this.fb.group({
    fname:['', [Validators.required, Validators.minLength(3)]],
    lname:['',[Validators.required, Validators.minLength(3)]],
    password:['',[Validators.required, Validators.minLength(3)]],
    cnf_pass:['',[Validators.required, Validators.minLength(3)]],
    email:['',[Validators.required, Validators.email]],
    phone:['',[Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    adhar:['',[Validators.required, Validators.minLength(12), Validators.maxLength(12)]]
  },{validators: PasswordValidator});

  onSubmit(){
    console.log(this.signupForm.value);
    this._signup.registerPatient(this.signupForm.value);
  }

}
