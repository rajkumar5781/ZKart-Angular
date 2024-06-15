import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

interface customerDetails {
  lastName: string;
  name: string;
  phone: number;
}

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet
  ],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css'
})
export class CustomerDetailsComponent {
  constructor(private http: HttpClient,private router:Router) {}

  matcher = new MyErrorStateMatcher();
  isSubmitting = false;
  isSuccess = false;
  isFormEdit: boolean = false;
  name: string = '';
  lastName: string = '';
  phone: number = NaN;
  isButtonActive: boolean = true;
  customerDetails: customerDetails = {
    lastName: '',
    name: '',
    phone: NaN,
  };

  customerDetailForm = new FormGroup({
    name: new FormControl('', [Validators.required, this.nameValidator()]),
    lastName: new FormControl('', [
      Validators.required,
      this.lastNameValidator(),
    ]),
    phone: new FormControl(NaN, [
      Validators.required,
      this.phoneNumberValidator(),
    ]),
  });

  async ngOnInit() {
    await this.getCustomerDetails();
    this.customerDetailForm.disable();
    this.customerDetailForm.get('name')?.setValue(this.customerDetails.name);
    this.customerDetailForm
      .get('lastName')
      ?.setValue(this.customerDetails.lastName);
    this.customerDetailForm.get('phone')?.setValue(this.customerDetails.phone);
  }

  async getCustomerDetails() {
    let url = 'http://localhost:8080/ZKart/CutomerDetail';

    const data = await firstValueFrom(this.http.get<any[]>(url));
    this.customerDetails = <customerDetails>data[0];
  }

  async upadteCustomerDetails() {
    let url = 'http://localhost:8080/ZKart/CutomerDetail';
    let params = new HttpParams().set('name', this.customerDetailForm.get('name')?.value || '')
    .set('lastName', this.customerDetailForm.get('lastName')?.value || '')
    .set('phone', this.customerDetailForm.get('phone')?.value || NaN);
      

    const data = await firstValueFrom(
      this.http.post(url, params, {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
        responseType: 'text',
      })
    );
  }

  allowStringOnly(event: KeyboardEvent) {}

  async onSubmit() {
    if (this.customerDetailForm.valid) {
      this.isSubmitting = true;
      this.isSubmitting = false;
      this.isSuccess = true;
      await this.upadteCustomerDetails();
      window.location.reload();
    } else {
      this.customerDetailForm.markAllAsTouched();
    }
  }

  nameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const namePattern = /^[a-zA-Z\s]{2,30}$/;
      const isValid = namePattern.test(control.value);
      return isValid ? null : { invalidCVV: true };
    };
  }

  lastNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const lastNamePattern = /^[a-zA-Z]$/;
      const isValid = lastNamePattern.test(control.value);
      return isValid ? null : { invalid: true };
    };
  }

  allOnlyNumber(event: KeyboardEvent): void {
    const isNumeric = /[0-9]/.test(event.key);
    const isControlKey = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ].includes(event.key);
    if (!isNumeric && !isControlKey) {
      event.preventDefault();
    }
  }

  phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const phoneNumberCodePattern = /^[0-9]{10,10}$/;
      const isValid = phoneNumberCodePattern.test(control.value);
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
  formEditAndSave() {
    this.isFormEdit = !this.isFormEdit;
    if (this.isFormEdit) {
      this.customerDetailForm.enable();
    } else {
      this.isButtonActive = false;

      this.onSubmit();
      this.customerDetailForm.disable();
      this.isButtonActive = true;
    }
  }

  goToOrderHistory(){
    this.router.navigate(['/home/account/orderhistory']);
  }

  goToReviewHistory(){
    this.router.navigate(['/home/account/reviewhistory']);
  }

  goToAddress(){
    this.router.navigate(['/home/account/addresscarts']);
  }
}
