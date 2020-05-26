import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppComponent } from '../app.component';
import { ActivatedRoute } from '@angular/router';
import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'app-disease-info',
  templateUrl: './disease-info.component.html',
  styleUrls: ['./disease-info.component.scss']
})
export class DiseaseInfoComponent implements OnInit {

  title = "DocsHelp"
  diseaseInfo = JSON.parse(localStorage.getItem('diseaseInfo'));

  get diseasesName(){
    return this.searchForm.get('diseasesName');
  }

  constructor(private fb: FormBuilder,private appcomponent: AppComponent,private route: ActivatedRoute) { 
    
  }

  public errorMessage = '';
  flag=true;
  ngOnInit() {
    let msg= this.route.snapshot.paramMap.get('message');
    if(msg){
      this.errorMessage = msg;
      this.flag=false;
    }
  }
  searchForm = this.fb.group({
    diseasesName:['']
  });

  searchDisease(){
    this.appcomponent.searchDisease();
  }

}
