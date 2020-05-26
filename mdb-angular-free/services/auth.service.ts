import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isAuthenticated() {
    // get the auth token from localStorage
    let token = localStorage.getItem('Token');

    // check if token is set, then...
    if (token) {
        return true;
    }
    return false;
    }
}
