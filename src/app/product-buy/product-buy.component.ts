import { Component, ElementRef, Input, NgModule, ViewChild, ViewEncapsulation, computed } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormGroupDirective, FormsModule, NgForm, Validators,ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import {  ErrorStateMatcher } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ProductInterface } from '../product-interface';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { error } from 'console';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

interface CartPayment {
  cartNumber: number;

  age: number;
}

interface NetBankingPayment{
  userName:String;
  password:String;
}



@Component({
  selector: 'app-product-buy',
  standalone: true,
  imports: [MatInputModule,MatFormFieldModule,FormsModule,ReactiveFormsModule,CommonModule,MatDatepickerModule,MatNativeDateModule],
  providers: [
    provideMomentDateAdapter(MY_FORMATS),
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './product-buy.component.html',
  styleUrl: './product-buy.component.css'
})


export class ProductBuyComponent {
  @ViewChild('creditCheckbox') creditCheckbox!: ElementRef<HTMLInputElement>;
  @ViewChild('netbankingCheckbox') netbankingCheckbox!: ElementRef<HTMLInputElement>;

emailFormControl = new FormControl('', [Validators.required, Validators.email]);
cvvFormControl = new FormControl('', [this.cvvValidator()]);
cartFormControl = new FormControl('',[this.cartNumberValidator()]);
userNameControl = new FormControl('',[this.userNameValidator()]);
passwordControl = new FormControl('',[this.passwordValidator()]);
postalCodeControl = new FormControl('',[this.postalCodevalidator()]);
phoneNumberControl = new FormControl('',[this.phoneNumberValidator()]);

  cartNumber: any;
  cvvValue =0;
  cartHolderName = "";
  userName = "";
  password = "";
  address="";
  state="";
  phone="";
  firstName="";
  lastName="";
  postalCode = "";
  @Input() productList!: ProductInterface[];
  response: string | undefined;

  constructor(private http: HttpClient){
    
  }
  
  matcher = new MyErrorStateMatcher();

  totalPrice = computed(() => {
    return this.productList.reduce((total, item) => total + item.total, 0);
  });

  togglePaymentMethod(method: string): void {

    if (method === 'credit') {
      console.log(this.netbankingCheckbox,"---->",this.creditCheckbox);
      this.netbankingCheckbox.nativeElement.checked = false;
      this.userNameControl.reset();
      this.passwordControl.reset();
      this.date.setValue(null);
      this.cartHolderName = "";
      this.cvvFormControl.reset();
      this.cartFormControl.reset();
    } else if (method === 'netbanking') {
      this.creditCheckbox.nativeElement.checked = false;
      this.date.setValue(null);
      this.cartHolderName = "";
      this.cvvFormControl.reset();
      this.cartFormControl.reset();
      this.userNameControl.reset();
      this.passwordControl.reset();
    }
  }

  cvvValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cvvPattern = /^[0-9]{3}$/;
      const isValid = cvvPattern.test(control.value);
      return isValid ? null : { invalidCVV: true };
    };
  }

  cartNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cartPattern = /^[0-9]{16}$/;
      const isValid = cartPattern.test(control.value);
      return isValid ? null : { invalidCVV: true };
    };
  }

  userNameValidator():ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      const userNamePattern = /^[a-zA-Z0-9]{8,20}$/;
      const isValid = userNamePattern.test(control.value);
      return isValid ? null : { invalidCVV: true };
    };
  }

  passwordValidator():ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      const userNamePattern = /^[a-zA-Z0-9]{6,20}$/;
      const isValid = userNamePattern.test(control.value);
      return isValid ? null : { invalidCVV: true };
    };
  }

  postalCodevalidator():ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      const postalCodePattern = /^[0-9]{6,6}$/;
      const isValid = postalCodePattern.test(control.value);
      return isValid ? null : { invalidCVV: true };
    };
  }

  phoneNumberValidator():ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      const phoneNumberCodePattern = /^[0-9]{10,10}$/;
      const isValid = phoneNumberCodePattern.test(control.value);
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

  allowAllNumberAndString(event: KeyboardEvent): void {
    const isNumeric = /^[a-zA-Z0-9]/.test(event.key);
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

  date = new FormControl(moment());


  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const currentYear = moment().year();
    const selectedYear = normalizedMonthAndYear.year();
    if (selectedYear >= currentYear && selectedYear <= currentYear + 9) {
      const ctrlValue = this.date.value ?? moment();
      ctrlValue.month(normalizedMonthAndYear.month());
      ctrlValue.year(selectedYear);
      this.date.setValue(ctrlValue);
    }
    datepicker.close();
    this.getSelectedMonthAndYear()
  }
  getSelectedMonthAndYear() {
    const selectedDate = this.date.value;
    if (selectedDate) {
      const month = selectedDate.month() + 1; // month() returns 0-11, so add 1 for 1-12
      const year = selectedDate.year();
      console.log(`Selected Month: ${month}, Selected Year: ${year}`);
      return { month, year };
    }
    return null;
  }

  billingDetailsValidate(){
   return this.postalCodeControl.valid && this.emailFormControl.valid && this.phoneNumberControl.valid && this.address.length>0 && this.firstName.length>0 && this.lastName.length>0 && this.address.length>0 && this.state.length>0 
  }

  buyNow(){
    console.log(this.netbankingCheckbox.nativeElement.checked,"--->",this.creditCheckbox.nativeElement.checked)
    if(!this.netbankingCheckbox.nativeElement.checked && !this.creditCheckbox.nativeElement.checked){
      alert("plaese choose any payment");
      return;
    }
    if(!this.billingDetailsValidate()){
      alert("Fill the correct billing details");
    }
    let params = new HttpParams().set("customerId",1);
    params.set("productId",this.productList[0].id).set("totalAmount",this.totalPrice()).set("address",this.address);
    if(this.netbankingCheckbox.nativeElement.checked){
      params.set('paymentWay', "netBanking");
    }
    else{
      params.set('paymentWay', "cart");
    }
    this.onSubmitOrder(params);
    try{
    // this.http.post("http://localhost:8080/ZKart/ProductBuying",params,{
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   }),responseType: 'text'
    // }).subscribe((d)=>{
    //   console.log(d);
    // }
    // )
  }
  catch(e){
    // console.log(e);
  }
  }
  postProductBuying(params: any): Observable<string> {
    const apiUrl = 'http://localhost:8080/ZKart/ProductBuying';
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post(apiUrl, params, { headers, responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  onSubmitOrder(params:any): void {
    this.postProductBuying(params).subscribe(
      () => {
        console.log('Order submitted successfully');
        alert("Payment was success");
      },
      error => {
        console.log('There was an error!');
        alert("Payment was failer");
      }
    );
  }


}
