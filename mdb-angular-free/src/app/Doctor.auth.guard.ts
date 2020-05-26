import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from 'services/auth.service';


@Injectable()
export class DoctorAuthGuard implements CanActivate {

    base_url: string;

    constructor(private router: Router
        , private authService: AuthService) {}

    canActivate() {
        // Check to see if a user has a valid token
        if (this.authService.isAuthenticated()) {
            // If they do, return true and allow the user to load app
            let type = localStorage.getItem('Type');
            if(type == "Doctor"){
                return true;
            }else{
                this.router.navigate(['/profilePatient']);
                return false;
            }
            
        }else{
            // If not, they redirect them to the login page
            this.router.navigate(['/home']);
            return false;
        }
        
    }


}
