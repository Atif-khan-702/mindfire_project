import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { Doctor } from '../Doctor';

@Component({
  selector: 'app-doctors-list',
  templateUrl: './doctors-list.component.html',
  styleUrls: ['./doctors-list.component.scss']
})
export class DoctorsListComponent implements OnInit {

  title = "DocsHelp"
  Name = localStorage.getItem('Name');
  Email = localStorage.getItem('Email');
  doctorList;

  constructor(private appComponent: AppComponent, private router:Router) {
    this.appComponent.change(router.url);
   }

  ngOnInit(): void {
    if(localStorage.getItem('doctors') != ''){
        this.doctorList = JSON.parse(localStorage.getItem('doctors'));
    }
    
  }

  logout(){
    localStorage.clear();
    this.appComponent.restore("/home")
    this.router.navigate(['/home']);
  }

  booking(doctor: Doctor){
    // console.log(doctor)
    localStorage.setItem('DoctorName', doctor['Name']);
    localStorage.setItem('DoctorShift', doctor['Shift']);
    localStorage.setItem('Qualification', doctor['Qualification']);
    localStorage.setItem('Experience', doctor['Experience']);
    localStorage.setItem('Specialization', doctor['Specialization']);
    localStorage.setItem('DoctorID',doctor['ID']);
    this.router.navigate(['/finalBooking'])
  }
}
