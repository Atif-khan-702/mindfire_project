import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Doctor } from 'src/app/Doctor';
import { catchError, retry } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Patient } from 'src/app/Patient';
import { Appointment } from 'src/Appointment';
import { promise } from 'protractor';
import { Disease } from 'src/app/Disease';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class ProjectServicesService {

  doctor: Doctor;
  error: any;
  patient: Patient;
  doctors: Doctor[];
  apointment: Appointment;
  apoint: Appointment;
  disease: Disease;
  appointments: Appointment[];

  urlRegister = "http://slimproject/filemaker/api/register";
  urlLoginDoctor = "http://slimproject/filemaker/api/doctor/login";
  urlLoginPatient = "http://slimproject/filemaker/api/patient/login";
  urlAddAvail = "http://slimproject/filemaker/api/doctor/add/availability";
  urlChangePassword = "http://slimproject/filemaker/api/changepassword";
  urlDoctorList = "http://slimproject/filemaker/api/doctorlist";
  urlAppointment = "http://slimproject/filemaker/api/bookAppointment";
  urlSearchDisease = "http://slimproject/filemaker/api/search/diseases";
  urlUpdateDoctor = "http://slimproject/filemaker/api/doctor/update";
  urlUpdatePatient = "http://slimproject/filemaker/api/patient/update";
  urlUpdateDoctorAvail = "http://slimproject/filemaker/api/doctor/updateAvailability";
  urlUpdateAppointment = "http://slimproject/filemaker/api/appointment/served";
  urlAddFeedback = "http://slimproject/filemaker/api/appointment/add/feedback";

  public token = localStorage.getItem('Token');
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    })
  };
  constructor(private http: HttpClient, private router: Router, private spinner: NgxSpinnerService) { }



  registerDoctor(formData) {
    this.http.post<any>(this.urlRegister, formData).subscribe(
      (result: any) => {
        if (result.status !== '201')
          this.router.navigate(['/registerDoctor', result.message]);
        else
          this.router.navigate(['/loginDoctor', 'true']);
      }
    )
  }

  registerPatient(formData) {
    this.http.post<any>(this.urlRegister, formData).subscribe(
      (result: any) => {
        if (result.status !== '201')
          this.router.navigate(['/register', result.message]);
        else
          this.router.navigate(['/login', 'true']);
      }
    )
  }

  async loginDoctor(formData) {
    this.getSpinner();
    this.doctor = await this.http.post<Doctor>(this.urlLoginDoctor, formData)
      .toPromise().then(Doctor => this.doctor = Doctor,
        error => this.error = error);
    if (this.doctor.Status == "Accepted") {
      localStorage.setItem('Token', this.doctor.Token);
      localStorage.setItem('Name', this.doctor.Name);
      localStorage.setItem('Email', this.doctor.Email);
      localStorage.setItem('Phone', this.doctor.Phone);
      localStorage.setItem('Adhar', this.doctor.Adhar);
      localStorage.setItem('Gender', this.doctor.Gender);
      localStorage.setItem('DOB', this.doctor.DOB);
      localStorage.setItem('Country', this.doctor.Country);
      localStorage.setItem('State', this.doctor.State);
      localStorage.setItem('City', this.doctor.City);
      localStorage.setItem('ID', this.doctor.ID);
      localStorage.setItem('Specialization', this.doctor.Specialization);
      localStorage.setItem('Experience', this.doctor.Experience);
      localStorage.setItem('Qualification', this.doctor.Qualification);
      localStorage.setItem('Status', this.doctor.Status);
      localStorage.setItem('BloodGroup', this.doctor.BloodGroup);
      localStorage.setItem('Type', this.doctor.UserType);
      localStorage.setItem('Availablity', this.doctor.Availablity);
      localStorage.setItem('BookedAppointments', JSON.stringify(this.doctor.Appointments));
      if (this.doctor.Availablity == "True") {
        localStorage.setItem('Shift', this.doctor.Shift);
        localStorage.setItem('Mode', this.doctor.Mode);
        localStorage.setItem('Day', this.doctor.Day);
        localStorage.setItem('TimeSlot', this.doctor.TimeSlot);
        localStorage.setItem('PatientTime', this.doctor.PatientTime);
      }
      this.router.navigate(['/profileDoctor']);

    } else if (this.doctor.Status == "Requested") {
      localStorage.setItem('TempName', this.doctor.Name);
      this.router.navigate(['/requested']);

    } else if (this.doctor.Status == "Rejected") {
      localStorage.setItem('TempName', this.doctor.Name);
      this.router.navigate(['/rejected']);
    } else if (this.error) {
      console.log(this.error.error.message);
      this.router.navigate(['/loginDoctor', this.error.error.message])
    }
  }

  //  errorHandler(error: HttpErrorResponse) {
  //   // return an observable with a user-facing error message
  //   if(error.status == 400){
  //     return throwError(
  //       'Record Not Found');
  //   }
  // };

  async loginPatient(formData) {
    this.getSpinner();
    this.patient = await this.http.post<Patient>(this.urlLoginPatient, formData)
      .toPromise().then(Patient => this.patient = Patient,
        error => this.error = error);
    if (this.patient.Status == "Accepted") {
      localStorage.setItem('Token', this.patient.Token);
      localStorage.setItem('Name', this.patient.Name);
      localStorage.setItem('Email', this.patient.Email);
      localStorage.setItem('Phone', this.patient.Phone);
      localStorage.setItem('Adhar', this.patient.Adhar);
      localStorage.setItem('Gender', this.patient.Gender);
      localStorage.setItem('DOB', this.patient.DOB);
      localStorage.setItem('Country', this.patient.Country);
      localStorage.setItem('State', this.patient.State);
      localStorage.setItem('City', this.patient.City);
      localStorage.setItem('ID', this.patient.ID);
      localStorage.setItem('Status', this.patient.Status);
      localStorage.setItem('BloodGroup', this.patient.BloodGroup);
      localStorage.setItem('Type', this.patient.UserType);
      localStorage.setItem('BookedAppointments', JSON.stringify(this.patient.Appointments));
      // console.log(this.patient.Appointments);
      this.router.navigate(['/profilePatient']);

    } else if (this.patient.Status == "Requested") {
      localStorage.setItem('TempName', this.patient.Name);
      this.router.navigate(['/requested']);

    } else if (this.patient.Status == "Rejected") {
      localStorage.setItem('TempName', this.patient.Name);
      this.router.navigate(['/rejected']);
    } else if (this.error) {
      console.log(this.error.error.message);
      this.router.navigate(['/login', this.error.error.message])
    }
  }

  async updateDoctor(formData) {
    this.doctor = await this.http.put<Doctor>(this.urlUpdateDoctor, formData, this.httpOptions)
      .toPromise().then(Doctor => this.doctor = Doctor,
        error => this.error = error);
    localStorage.setItem('Name', this.doctor.Name);
    localStorage.setItem('Email', this.doctor.Email);
    localStorage.setItem('Phone', this.doctor.Phone);
    localStorage.setItem('Adhar', this.doctor.Adhar);
    localStorage.setItem('Gender', this.doctor.Gender);
    localStorage.setItem('DOB', this.doctor.DOB);
    localStorage.setItem('Country', this.doctor.Country);
    localStorage.setItem('State', this.doctor.State);
    localStorage.setItem('City', this.doctor.City);
    localStorage.setItem('ID', this.doctor.ID);
    localStorage.setItem('Specialization', this.doctor.Specialization);
    localStorage.setItem('Experience', this.doctor.Experience);
    localStorage.setItem('Qualification', this.doctor.Qualification);
    localStorage.setItem('BloodGroup', this.doctor.BloodGroup);
    this.router.navigate(['/doctorUpdate', 'done']);
  }

  async updatePatient(formData) {
    this.doctor = await this.http.put<Patient>(this.urlUpdatePatient, formData, this.httpOptions)
      .toPromise().then(Patient => this.patient = Patient,
        error => this.error = error);
    localStorage.setItem('Name', this.patient.Name);
    localStorage.setItem('Email', this.patient.Email);
    localStorage.setItem('Phone', this.patient.Phone);
    localStorage.setItem('Adhar', this.patient.Adhar);
    localStorage.setItem('Gender', this.patient.Gender);
    localStorage.setItem('DOB', this.patient.DOB);
    localStorage.setItem('Country', this.patient.Country);
    localStorage.setItem('State', this.patient.State);
    localStorage.setItem('City', this.patient.City);
    localStorage.setItem('ID', this.patient.ID);
    localStorage.setItem('BloodGroup', this.patient.BloodGroup);
    this.router.navigate(['/patientUpdate', 'done']);
  }

  async updateAvailability(formData) {
    this.doctor = await this.http.put<Doctor>(this.urlUpdateDoctorAvail, formData, this.httpOptions)
      .toPromise().then(Doctor => this.doctor = Doctor,
        error => this.error = error);
    localStorage.setItem('ID', this.doctor.ID);
    localStorage.setItem('Shift', this.doctor.Shift);
    localStorage.setItem('Mode', this.doctor.Mode);
    localStorage.setItem('Day', this.doctor.Day);
    localStorage.setItem('TimeSlot', this.doctor.TimeSlot);
    localStorage.setItem('PatientTime', this.doctor.PatientTime);
    this.router.navigate(['/doctorUpdate', 'done']);
  }

  async addAvailability(formData) {
    this.doctor = await this.http.post<Doctor>(this.urlAddAvail, formData, this.httpOptions)
      .toPromise().then(Doctor => this.doctor = Doctor,
        error => this.error = error);
    localStorage.setItem('Name', this.doctor.Name);
    localStorage.setItem('Email', this.doctor.Email);
    localStorage.setItem('Phone', this.doctor.Phone);
    localStorage.setItem('Adhar', this.doctor.Adhar);
    localStorage.setItem('Gender', this.doctor.Gender);
    localStorage.setItem('DOB', this.doctor.DOB);
    localStorage.setItem('Country', this.doctor.Country);
    localStorage.setItem('State', this.doctor.State);
    localStorage.setItem('City', this.doctor.City);
    localStorage.setItem('ID', this.doctor.ID);
    localStorage.setItem('Specialization', this.doctor.Specialization);
    localStorage.setItem('Experience', this.doctor.Experience);
    localStorage.setItem('Qualification', this.doctor.Qualification);
    localStorage.setItem('Status', this.doctor.Status);
    localStorage.setItem('BloodGroup', this.doctor.BloodGroup);
    localStorage.setItem('Type', this.doctor.UserType);
    localStorage.setItem('Availablity', this.doctor.Availablity);
    localStorage.setItem('Shift', this.doctor.Shift);
    localStorage.setItem('Mode', this.doctor.Mode);
    localStorage.setItem('Day', this.doctor.Day);
    localStorage.setItem('TimeSlot', this.doctor.TimeSlot);
    localStorage.setItem('PatientTime', this.doctor.PatientTime);
    this.router.navigate(['/profileDoctor']);
  }

  doctorChangePassword(formData) {
    // console.log(formData);
    this.http.post<any>(this.urlChangePassword, formData, this.httpOptions).subscribe(
      (result: any) => {
        this.router.navigate(['/doctorChangePassword', result.message]);
      }
    )
  }

  patientChangePassword(formData) {
    // console.log(formData);
    this.http.post<any>(this.urlChangePassword, formData, this.httpOptions).subscribe(
      (result: any) => {
        this.router.navigate(['/patientChangePassword', result.message]);
      }
    )
  }

  async doctorList(formData) {
    this.doctors = await this.http.post<Doctor[]>(this.urlDoctorList, formData)
      .toPromise().then(doctors => this.doctors = doctors,
        error => this.error = error);
    localStorage.removeItem('doctors');
    localStorage.setItem("doctors", JSON.stringify(this.doctors));
    if (localStorage.getItem('doctors') != '') {
      this.router.navigate(['/doctorList']);
    }
  }

  async appointment(formData) {
    // this.getSpinner();
    this.apointment = await this.http.post<Appointment>(this.urlAppointment, formData, this.httpOptions)
      .toPromise().then(apointment => this.apointment = apointment,
        error => this.error = error);
    if (this.apointment.Status == "Booked") {
      localStorage.setItem("appointment", JSON.stringify(this.apointment));
      this.router.navigate(['/profilePatient', 'true']);
    } else if (this.error) {
      this.router.navigate(['/finalBooking', this.error.error.message]);
    }
  }

  async diseaseInfo(formData) {
    this.disease = await this.http.post<Disease>(this.urlSearchDisease, formData)
      .toPromise().then(disease => this.disease = disease,
        error => this.error = error);
    if (this.error) {
      localStorage.removeItem('diseaseInfo');
      this.router.navigate(['/diseaseInfo', this.error.error.message]);
    } else if (this.disease.DiseaseName !== '') {
      localStorage.setItem("diseaseInfo", JSON.stringify(this.disease));
      this.router.navigate(['/diseaseInfo']);
    }
  }

  async PatientDiseaseInfo(formData) {
    this.disease = await this.http.post<Disease>(this.urlSearchDisease, formData)
      .toPromise().then(disease => this.disease = disease,
        error => this.error = error);
    if (this.error) {
      localStorage.removeItem('diseaseInfo');
      this.router.navigate(['/patientdiseaseInfo', this.error.error.message]);
    } else if (this.disease.DiseaseName !== '') {
      localStorage.setItem("diseaseInfo", JSON.stringify(this.disease));
      this.router.navigate(['/patientdiseaseInfo']);
    }
  }

  async DoctorDiseaseInfo(formData) {
    this.disease = await this.http.post<Disease>(this.urlSearchDisease, formData)
      .toPromise().then(disease => this.disease = disease,
        error => this.error = error);
    if (this.error) {
      localStorage.removeItem('diseaseInfo');
      this.router.navigate(['/doctordiseaseInfo', this.error.error.message]);
    } else if (this.disease.DiseaseName !== '') {
      localStorage.setItem("diseaseInfo", JSON.stringify(this.disease));
      this.router.navigate(['/doctordiseaseInfo']);
    }
  }

  async servedAppointment(formData) {
    this.apointment = await this.http.put<Appointment>(this.urlUpdateAppointment, formData, this.httpOptions)
      .toPromise().then(apointment => this.apointment = apointment,
        error => this.error = error);
    this.appointments = JSON.parse(localStorage.getItem('BookedAppointments'));
    this.appointments.forEach(element => {
      if (element['AppointmentId'] == this.apointment.AppointmentId) {
        element['Status'] = "Served";
      }
    });
    localStorage.setItem('BookedAppointments', JSON.stringify(this.appointments));
    this.router.navigate(['/profileDoctor']);
  }

  async addFeedback(formData) {
    this.apointment = await this.http.put<Appointment>(this.urlAddFeedback, formData, this.httpOptions)
      .toPromise().then(apointment => this.apointment = apointment,
        error => this.error = error);
    this.appointments = JSON.parse(localStorage.getItem('BookedAppointments'));
    this.appointments.forEach(element => {
      if (element['AppointmentId'] == this.apointment.AppointmentId) {
        element['Feedback'] = this.apointment.Feedback;
      }
    });
    localStorage.setItem('BookedAppointments', JSON.stringify(this.appointments));
    this.router.navigate(['/profileDoctor']);
  }

  getSpinner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 3 * 1000);
  }

}
