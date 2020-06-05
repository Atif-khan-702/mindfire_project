import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginDoctorComponent } from './login-doctor/login-doctor.component';
import { RegisterComponent } from './register/register.component';
import { RegisterDoctorComponent } from './register-doctor/register-doctor.component';
import { HomepageComponent } from './homepage/homepage.component';
import { DoctorUpdateComponent } from './doctor-update/doctor-update.component';
import { ProfileDoctorComponent } from './profile-doctor/profile-doctor.component';
import { ProfilePatientComponent } from './profile-patient/profile-patient.component';
import { PatientUpdateComponent } from './patient-update/patient-update.component';
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


const routes: Routes = [
  {path: 'login', canActivate: [ProfileAuthGuard], component: LoginComponent},
  {path: 'login/:Message', canActivate: [ProfileAuthGuard],component: LoginComponent},
  {path: 'home', component: HomepageComponent},
  {path: 'loginDoctor', canActivate: [ProfileAuthGuard], component: LoginDoctorComponent},
  {path: 'loginDoctor/:Message', canActivate: [ProfileAuthGuard], component: LoginDoctorComponent},
  {path: 'register', canActivate: [ProfileAuthGuard], component: RegisterComponent},
  {path: 'registerDoctor', canActivate: [ProfileAuthGuard], component: RegisterDoctorComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'doctorUpdate', canActivate: [DoctorAuthGuard], component: DoctorUpdateComponent},
  {path: 'doctorUpdate/:Message', canActivate: [DoctorAuthGuard], component: DoctorUpdateComponent},
  {path: 'patientUpdate', canActivate: [PatientAuthGuard], component: PatientUpdateComponent},
  {path: 'patientUpdate/:Message', canActivate: [PatientAuthGuard], component: PatientUpdateComponent},
  {path: 'profileDoctor', canActivate: [DoctorAuthGuard], component: ProfileDoctorComponent},
  {path: 'profilePatient', canActivate: [PatientAuthGuard], component: ProfilePatientComponent},
  {path: 'profilePatient/:Message', canActivate: [PatientAuthGuard], component: ProfilePatientComponent},
  {path: 'requested', component: RequestedComponent},
  {path: 'rejected', component: RejectedComponent},
  {path: 'patientAppointment', canActivate: [PatientAuthGuard], component: PatientAppointmentComponent},
  {path: 'finalBooking', canActivate: [PatientAuthGuard], component: FinalBookingComponent},
  {path: 'finalBooking/:Message', canActivate: [PatientAuthGuard], component: FinalBookingComponent},
  // {path: 'patientAppointment/:message', canActivate: [PatientAuthGuard], component: PatientAppointmentComponent},
  {path: 'doctorInfo', canActivate: [DoctorAuthGuard], component: DoctorInfoComponent},
  {path: 'patientInfo', canActivate: [PatientAuthGuard], component: PatientInfoComponent},
  {path: 'doctorList', canActivate: [PatientAuthGuard], component: DoctorsListComponent},
  {path: 'doctorChangePassword', canActivate: [DoctorAuthGuard], component: DoctorChangePasswordComponent},
  {path: 'doctorChangePassword/:message', canActivate: [DoctorAuthGuard], component: DoctorChangePasswordComponent},
  {path: 'patientChangePassword', canActivate: [PatientAuthGuard], component: PatientChangePasswordComponent},
  {path: 'patientChangePassword/:message', canActivate: [PatientAuthGuard], component: PatientChangePasswordComponent},
  {path: 'patientAppointmentList', canActivate: [PatientAuthGuard], component: PatientAppointmentListComponent},
  {path: 'doctorAppointmentList', canActivate: [DoctorAuthGuard], component: DoctorAppointmentListComponent},
  {path: 'doctorFeedback', canActivate: [DoctorAuthGuard], component: DoctorFeedbackComponent},
  {path: 'diseaseInfo', component:DiseaseInfoComponent},
  {path: 'diseaseInfo/:message', component:DiseaseInfoComponent},
  {path: 'patientdiseaseInfo', component:PatientDiseaseInfoComponent},
  {path: 'patientdiseaseInfo/:message', component:PatientDiseaseInfoComponent},
  {path: 'doctordiseaseInfo', component:DoctorDiseaseInfoComponent},
  {path: 'doctordiseaseInfo/:message', component:DoctorDiseaseInfoComponent},   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
