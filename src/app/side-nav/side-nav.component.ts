import { Component, EventEmitter, Output } from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    CommonModule,
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {

  @Output() closeSidenav = new EventEmitter<void>();

  step :number = -1;
  activeSubMenu : string = "";

  constructor(private router:Router,private activatedRoute: ActivatedRoute,private location : Location){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.getLastSegment();
      }
    });
  }

  setStep(index: number) {
    this.step = index;
  }

  setSubMenu(menuOption:string,option:string){
    this.activeSubMenu = option;
    if(menuOption!='' && option!=''){
    this.router.navigate(['home/'+menuOption+'/'+option]);
    }
    else if(menuOption!=''){
      this.router.navigate(['home/'+menuOption]);
    }
  }

  onlyHeadersClicked(index : number,menuOption:string,option:string){
    this.setStep(index);
    this.setSubMenu(menuOption,option);
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  closeStep(){
    this.step = 99;
  }

  navclose(){
    this.closeSidenav.emit();
  }

  getLastSegment(): void {
    const path = this.location.path();
    const segments = path.split('/');
    const lastSegment = segments[2];
    this.activeSubMenu = segments[3];
    let val = 0;
    switch (lastSegment) {
      case 'dashboard':{
        val = 0;
        break;
      }
      case 'ecommerce': {
        val = 1;
        break;
      }
      case 'order': {
        val = 2;
        break;
      }
      case 'users': {
        val = 3;
        break;
      }
      case 'analytics':{
        val = 4;
        break;
      }
    }
    this.step = val;
  }

}
