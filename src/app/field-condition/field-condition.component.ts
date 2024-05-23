import { Component, Input } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-field-condition',
  standalone: true,
  imports: [MatCheckboxModule,FormsModule,CommonModule],
  templateUrl: './field-condition.component.html',
  styleUrl: './field-condition.component.css'
})
export class FieldConditionComponent {

  @Input() fieldDetails: any
  isChecked=true;

  setAll(){
    if(this.fieldDetails.type=='varchar'){
    this.fieldDetails.value = "";
    }
    else if(this.fieldDetails.type=='int'){
      this.fieldDetails.value = null;
    }
  }
}
