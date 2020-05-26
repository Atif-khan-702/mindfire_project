import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';
import { PasswordValidator } from '../shared/password.validator';
import { ProjectServicesService } from 'services/project-services.service';

@Component({
  selector: 'app-doctor-change-password',
  templateUrl: './doctor-change-password.component.html',
  styleUrls: ['./doctor-change-password.component.scss']
})
export class DoctorChangePasswordComponent implements OnInit {

  title = "DocsHelp"
  Name = localStorage.getItem('Name');
  Email = localStorage.getItem('Email');
  ID=localStorage.getItem('ID');

 
  constructor(private appComponent: AppComponent, private route:ActivatedRoute, private router: Router, private fb: FormBuilder, private projectService: ProjectServicesService) {
    this.appComponent.change(router.url);
   }

   get oldPassword(){
    return this.passwordForm.get('oldPassword');
  }
  get password(){
    return this.passwordForm.get('password');
  }
  get cnf_pass(){
    return this.passwordForm.get('cnf_pass');
  }


  public infoMessage = '';
  ngOnInit() {
    let msg= this.route.snapshot.paramMap.get('message');
      if(msg!=='') {
          this.infoMessage = msg;
      }
  }

  passwordForm = this.fb.group({
    id:[this.ID],
    oldPassword:['',[Validators.required, Validators.minLength(3)]],
    password:['',[Validators.required, Validators.minLength(3)]],
    cnf_pass:['',[Validators.required, Validators.minLength(3)]]
  },{validators: PasswordValidator});

  logout(){
    localStorage.clear();
    this.appComponent.restore("/home")
    this.router.navigate(['/home']);
  }

  onSubmit(){
    console.log(this.passwordForm.value);
    this.projectService.doctorChangePassword(this.passwordForm.value);
  }

}
