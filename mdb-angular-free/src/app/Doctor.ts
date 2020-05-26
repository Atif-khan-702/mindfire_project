import { Appointment } from 'src/Appointment';

export interface Doctor{
    Name: string,
    Email: string,
    Phone: string,
    Gender: string,
    Adhar: string,
    DOB: string,
    Country: string,
    State: string,
    City: string,
    Token: string,
    ID: string,
    Specialization: string,
    Qualification : string,
    Experience: string,
    Status: string,
    BloodGroup: string,
    Day:string,
    Mode: string,
    Shift:string,
    TimeSlot:string,
    PatientTime:string,
    UserType:string,
    Availablity:string,
    Appointments: Appointment[]
}