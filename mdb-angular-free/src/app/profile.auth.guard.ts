import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from 'services/auth.service';


@Injectable()
export class ProfileAuthGuard implements CanActivate {

    base_url: string;

    constructor(private router: Router
        , private authService: AuthService) {}

    canActivate() {
        if (this.authService.isAuthenticated()) {
            let type = localStorage.getItem('Type');
            if(type == "Doctor"){
                this.router.navigate(['/profileDoctor']); 
            }else{
                this.router.navigate(['/profilePatient']);
            }
            return false;
        }
        return true;
    }


}
