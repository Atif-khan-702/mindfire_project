import { Appointment } from 'src/Appointment';

export interface Patient{
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
    Status: string,
    BloodGroup: string,
    UserType:string,
    Appointments: Appointment[]
}