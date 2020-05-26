import { Component, OnInit } from '@angular/core';
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';
import { ProjectServicesService } from 'services/project-services.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DocsHelp';
  Name = localStorage.getItem('Name');
  Email = localStorage.getItem('Email');

  ShowLoadingIndicator = true;
  constructor(private route: Router, private fb: FormBuilder, private projectService: ProjectServicesService) {
    this.route.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.ShowLoadingIndicator = true;
      }
      if (routerEvent instanceof NavigationEnd) {
        this.ShowLoadingIndicator = false;
      }
    })
  }

  get diseasesName() {
    return this.searchForm.get('diseasesName');
  }

  flag1 = true;
  flag2 = false;
  flag3 = false

  // when profileDoctor loaded
  change(url) {
    if (url == "/profileDoctor" || url == "/doctorUpdate" || url == "/profilePatient" || url == "/profilePatient/true" || url == "/patientUpdate" || url == "/doctorInfo" || url == "/patientInfo"
      || url == "/doctorChangePassword" || url == "/doctorChangePassword/Password%20successfully%20changed" || url == "/patientChangePassword" || url == "/patientChangePassword/Password%20successfully%20changed"
      || url == "/patientAppointment" || url == "/doctorList" || url == "/finalBooking" || url == "/patientAppointmentList" || url == "/doctorAppointmentList" || url == "/patientdiseaseInfo" || url == "/patientdiseaseInfo/Disease%20Not%20Found"
      || url == "/doctordiseaseInfo" || url == "/doctordiseaseInfo/Disease%20Not%20Found" || url == "/doctorFeedback")
      this.flag1 = false;
    this.flag2 = false;
    this.flag3 = false
  }

  // after logout from profile
  restore(url) {
    if (url == "/home")
      this.flag1 = true
    this.flag2 = false
    this.flag3 = false
  }

  // when routing doctor profile to home with token(means still login)
  restore1(url) {
    if (url == "/home")
      this.flag2 = true
  }

  // when routing patient profile to home with token(means still login)
  restore2(url) {
    if (url == "/home")
      this.flag3 = true
  }


  // logout from homepage
  afterLogout() {
    this.flag3 = false
    this.flag2 = false
    this.flag1 = true
  }

  // backtoProfile(){
  //   this.flag2=false
  //   this.route.navigate(['/profileDoctor']);
  // }

  // logout from homepage
  logout() {
    localStorage.clear();
    this.afterLogout()
    this.route.navigate(['/home']);
  }

  searchForm = this.fb.group({
    diseasesName: ['']
  });

  searchDisease() {
    // console.log(this.searchForm.value);
    this.projectService.diseaseInfo(this.searchForm.value);
  }

}
