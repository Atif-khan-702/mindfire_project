import { AbstractControl } from "@angular/forms";

export function PasswordValidator(control: AbstractControl): { [key: string]: boolean} | null {
    const password = control.get('password');
    const cnf_pass = control.get('cnf_pass');
    if(password.pristine || cnf_pass.pristine){
        return null;
    }
    return password && cnf_pass && password.value  !== cnf_pass.value ?
    {'mismatch' : true} : null;
}