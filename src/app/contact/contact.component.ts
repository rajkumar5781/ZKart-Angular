import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn,FormsModule,ReactiveFormsModule, Validators, FormGroupDirective, NgForm, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MatIconModule,MatInputModule,MatFormFieldModule,FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  matcher = new MyErrorStateMatcher();

  contactForm = new FormGroup({
    name: new FormControl('', [Validators.required, this.nameValidator()]),
    email: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('', [Validators.required, this.subjectValidator()]),
    message: new FormControl('', [Validators.required, this.messageValidator()]),
  });

  isSubmitting = false;
  isSuccess = false;


  cartNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cartPattern = /^[0-9]{16}$/;
      const isValid = cartPattern.test(control.value);
      return isValid ? null : { invalidCVV: true };
    };
  }

  allOnlyNumber(event: KeyboardEvent): void {
    const isNumeric = /[0-9]/.test(event.key);
    const isControlKey = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key);
        if (!isNumeric && !isControlKey) {
      event.preventDefault();
    }
  }

  allowStringOnly(event: KeyboardEvent):void{
    const isCharacter = /^[a-zA-Z]+$/.test(event.key);
    const isControlKey = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key);
        if (!isCharacter && !isControlKey) {
      event.preventDefault();
    }
  }

  nameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const namePattern = /^[a-zA-Z]{2,30}$/;
      const isValid = namePattern.test(control.value);
      return isValid ? null : { invalidCVV: true };
    };
  }

  subjectValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const subjectPattern = /^[a-zA-Z]{2,100}$/;
      const isValid = subjectPattern.test(control.value);
      return isValid ? null : { invalidCVV: true };
    };
  }

  messageValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const messagePattern = /^[a-zA-Z\s]{2,200}$/;
      const isValid = messagePattern.test(control.value);
      return isValid ? null : { invalidMessage: true };
    };
  }

 onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      setTimeout(() => {
        this.isSubmitting = false;
        this.isSuccess = true;
        setTimeout(() => {
            window.location.reload();
        }, 3000);
      }, 2000);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
  
}
