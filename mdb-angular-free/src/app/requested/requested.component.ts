import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-requested',
  templateUrl: './requested.component.html',
  styleUrls: ['./requested.component.scss']
})
export class RequestedComponent implements OnInit {

  constructor(private router:Router) { }
  
  name = localStorage.getItem('TempName');

  ngOnInit(): void {
  }

  BackToHome(){
    localStorage.clear();
    this.router.navigate(['/home']);
  }

}
