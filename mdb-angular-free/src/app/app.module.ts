
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { LoginDoctorComponent } from './login-doctor/login-doctor.component';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './register/register.component';
import { RegisterDoctorComponent } from './register-doctor/register-doctor.component';
import { HomepageComponent } from './homepage/homepage.component';
import { DoctorUpdateComponent } from './doctor-update/doctor-update.component';
import { ProfileDoctorComponent } from './profile-doctor/profile-doctor.component';
import { ProfilePatientComponent } from './profile-patient/profile-patient.component';
import { PatientUpdateComponent } from './patient-update/patient-update.component';
import { AuthService } from 'services/auth.service';
import { ProfileAuthGuard } from './profile.auth.guard';
import { DoctorAuthGuard } from './Doctor.auth.guard';
import { PatientAuthGuard } from './patient.auth.guard';
import { RequestedComponent } from './requested/requested.component';
import { RejectedComponent } from './rejected/rejected.component';
import { PatientAppointmentComponent } from './patient-appointment/patient-appointment.component';
import { DoctorInfoComponent } from './doctor-info/doctor-info.component';
import { PatientInfoComponent } from './patient-info/patient-info.component';
import { DoctorChangePasswordComponent } from './doctor-change-password/doctor-change-password.component';
import { PatientChangePasswordComponent } from './patient-change-password/patient-change-password.component';
import { DoctorsListComponent } from './doctors-list/doctors-list.component';
import { FinalBookingComponent } from './final-booking/final-booking.component';
import { PatientAppointmentListComponent } from './patient-appointment-list/patient-appointment-list.component';
import { DoctorAppointmentListComponent } from './doctor-appointment-list/doctor-appointment-list.component';
import { DiseaseInfoComponent } from './disease-info/disease-info.component';
import { PatientDiseaseInfoComponent } from './patient-disease-info/patient-disease-info.component';
import { DoctorDiseaseInfoComponent } from './doctor-disease-info/doctor-disease-info.component';
import { DoctorFeedbackComponent } from './doctor-feedback/doctor-feedback.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { FileUploadComponent } from './file-upload/file-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginDoctorComponent,
    RegisterComponent,
    RegisterDoctorComponent,
    HomepageComponent,
    DoctorUpdateComponent,
    ProfileDoctorComponent,
    ProfilePatientComponent,
    PatientUpdateComponent,
    RequestedComponent,
    RejectedComponent,
    PatientAppointmentComponent,
    DoctorInfoComponent,
    PatientInfoComponent,
    DoctorChangePasswordComponent,
    PatientChangePasswordComponent,
    DoctorsListComponent,
    FinalBookingComponent,
    PatientAppointmentListComponent,
    DoctorAppointmentListComponent,
    DiseaseInfoComponent,
    PatientDiseaseInfoComponent,
    DoctorDiseaseInfoComponent,
    DoctorFeedbackComponent,
    FileUploadComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  providers: [DoctorAuthGuard,PatientAuthGuard, AuthService,ProfileAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
