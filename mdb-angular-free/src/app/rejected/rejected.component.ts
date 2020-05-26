import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rejected',
  templateUrl: './rejected.component.html',
  styleUrls: ['./rejected.component.scss']
})
export class RejectedComponent implements OnInit {

  constructor(private router:Router) { }

  name = localStorage.getItem('TempName');

  ngOnInit(): void {
  }

  BackToHome(){
    localStorage.clear();
    this.router.navigate(['/home']);
  }

}
