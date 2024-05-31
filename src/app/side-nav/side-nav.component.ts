import { Component, EventEmitter, Output } from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  step :number = 0;
  activeSubMenu : string = "";

  constructor(private router:Router){}

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
}
