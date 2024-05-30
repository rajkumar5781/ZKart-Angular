import { Component, Input, OnInit } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {  FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-field-condition',
  standalone: true,
  imports: [MatCheckboxModule,FormsModule,CommonModule,MatSelectModule,MatFormFieldModule,ReactiveFormsModule,MatInputModule],
  templateUrl: './field-condition.component.html',
  styleUrl: './field-condition.component.css'
})
export class FieldConditionComponent implements OnInit {

  @Input() fieldDetails: any;
  isChecked = true;
  errorProperty = null; 

  contactForm = new FormGroup({
    from: new FormControl('', [Validators.required, this.formValidator()]),
    to: new FormControl('', [Validators.required, this.toValidator()]),
  });

  ngOnInit() {
    this.contactForm.get('from')?.valueChanges.subscribe(() => {
      this.contactForm.get('to')?.updateValueAndValidity();
    });
  }

  setAll() {
    if (this.fieldDetails.type === 'varchar') {
      this.fieldDetails.value = '';
    } else if (this.fieldDetails.type === 'int') {
      this.fieldDetails.value = null;
      if(this.fieldDetails.ui_type=='range'){
        this.fieldDetails.value = [];
      }
    }
  }

  formValidator(): any {
    return (control: FormControl) => {
      const fromPattern = /^[0-9]{1,8}$/;
      const isValid = fromPattern.test(control.value);
      return isValid ? null : { invalid: true };
    };
  }

  toValidator(): any {
    return (control: FormControl) => {
      const toPattern = /^[0-9]{1,8}$/;
      const isValid = toPattern.test(control.value) && control.value > (this.contactForm.get('from')?.value || 0);
      return isValid ? null : { invalid: true };
    };
  }
}
