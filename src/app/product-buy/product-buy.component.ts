import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  ViewEncapsulation,
  computed,
} from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroupDirective,
  FormsModule,
  NgForm,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ProductInterface } from '../product-interface';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, firstValueFrom, throwError } from 'rxjs';
// import { getUserId } from '../auth.guard';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { environment } from '../../../enviroment';

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

interface CartPayment {
  cartNumber: number;

  age: number;
}

interface NetBankingPayment {
  userName: String;
  password: String;
}

@Component({
  selector: 'app-product-buy',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatIconModule,
  ],
  providers: [provideMomentDateAdapter(MY_FORMATS)],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './product-buy.component.html',
  styleUrl: './product-buy.component.css',
})
export class ProductBuyComponent {
  @ViewChild('creditCheckbox') creditCheckbox!: ElementRef<HTMLInputElement>;
  @ViewChild('netbankingCheckbox')
  netbankingCheckbox!: ElementRef<HTMLInputElement>;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  cvvFormControl = new FormControl('', [this.cvvValidator()]);
  cartFormControl = new FormControl('', [this.cartNumberValidator()]);
  userNameControl = new FormControl('', [this.userNameValidator()]);
  passwordControl = new FormControl('', [this.passwordValidator()]);
  postalCodeControl = new FormControl('', [this.postalCodevalidator()]);
  phoneNumberControl = new FormControl('', [this.phoneNumberValidator()]);

  cartNumber: any;
  cvvValue = 0;
  cartHolderName = '';
  userName = '';
  password = '';
  address = '';
  state = '';
  phone = '';
  firstName = '';
  lastName = '';
  postalCode = '';
  @Input() productList!: ProductInterface[];
  response: string | undefined;
  selectedAddress: any;
  tempSelectedAddress : any;
  addressLoading = false;
  isSelectAddress = false;
  addressDetailsList: any;

  constructor(private http: HttpClient, private router: Router) {}

  matcher = new MyErrorStateMatcher();

  async ngOnInit() {
    await this.getDefaultAddress();
  }

  totalPrice = computed(() => {
    return this.productList.reduce((total, item) => total + item.total, 0);
  });

  togglePaymentMethod(method: string): void {
    if (method === 'credit') {
      this.netbankingCheckbox.nativeElement.checked = false;
      this.userNameControl.reset();
      this.passwordControl.reset();
      this.date.setValue(null);
      this.cartHolderName = '';
      this.cvvFormControl.reset();
      this.cartFormControl.reset();
    } else if (method === 'netbanking') {
      this.creditCheckbox.nativeElement.checked = false;
      this.date.setValue(null);
      this.cartHolderName = '';
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

  userNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const userNamePattern = /^[a-zA-Z0-9]{8,20}$/;
      const isValid = userNamePattern.test(control.value);
      return isValid ? null : { invalidCVV: true };
    };
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const userNamePattern = /^[a-zA-Z0-9]{6,20}$/;
      const isValid = userNamePattern.test(control.value);
      return isValid ? null : { invalidCVV: true };
    };
  }

  postalCodevalidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const postalCodePattern = /^[0-9]{6,6}$/;
      const isValid = postalCodePattern.test(control.value);
      return isValid ? null : { invalidCVV: true };
    };
  }

  phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const phoneNumberCodePattern = /^[0-9]{10,10}$/;
      const isValid = phoneNumberCodePattern.test(control.value);
      return isValid ? null : { invalidCVV: true };
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

  allowAllNumberAndString(event: KeyboardEvent): void {
    const isNumeric = /^[a-zA-Z0-9]/.test(event.key);
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

  allowStringOnly(event: KeyboardEvent): void {
    const isCharacter = /^[a-zA-Z]+$/.test(event.key);
    const isControlKey = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ].includes(event.key);
    if (!isCharacter && !isControlKey) {
      event.preventDefault();
    }
  }

  date = new FormControl(moment());

  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const currentYear = moment().year();
    const selectedYear = normalizedMonthAndYear.year();
    if (selectedYear >= currentYear && selectedYear <= currentYear + 9) {
      const ctrlValue = this.date.value ?? moment();
      ctrlValue.month(normalizedMonthAndYear.month());
      ctrlValue.year(selectedYear);
      this.date.setValue(ctrlValue);
    }
    datepicker.close();
    this.getSelectedMonthAndYear();
  }
  getSelectedMonthAndYear() {
    const selectedDate = this.date.value;
    if (selectedDate) {
      const month = selectedDate.month() + 1; // month() returns 0-11, so add 1 for 1-12
      const year = selectedDate.year();
      return { month, year };
    }
    return null;
  }

  // billingDetailsValidate(){
  //  return this.postalCodeControl.valid && this.emailFormControl.valid && this.phoneNumberControl.valid && this.address.length>0 && this.firstName.length>0 && this.lastName.length>0 && this.address.length>0 && this.state.length>0
  // }

  buyNow() {
    if (
      !this.netbankingCheckbox.nativeElement.checked &&
      !this.creditCheckbox.nativeElement.checked
    ) {
      alert('plaese choose any payment');
      return;
    }
    if(this.selectedAddress==null){
      alert('plaese choose Address');
      return;
    }
    let productDetails: any = this.productList;
    let params = new HttpParams();
    params = params
      .set('productId', this.productList[0].id)
      .set('totalAmount', this.totalPrice())
      .set('address', this.address)
      .set('addressId', this.selectedAddress.id)
      .set('productDetails', JSON.stringify(productDetails));
    if (this.netbankingCheckbox.nativeElement.checked) {
      params = params.set('paymentWay', 'netBanking');
      if(!this.userNameControl.valid || !this.passwordControl.valid ){
        alert('plaese fill the userName and password.');
        return;
      }
    } else {
      if(!this.date.valid || !this.cartFormControl.valid || !this.cvvFormControl.valid){
        alert('plaese fill the payment details.');
        return;
      }
      params = params.set('paymentWay', 'cart');
    }
    this.onSubmitOrder(params);
  }
  postProductBuying(params: any): Observable<string> {
    const apiUrl = environment.server+'/ZKart/ProductBuying';
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.http
      .post(apiUrl, params, { headers, responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  onSubmitOrder(params: any): void {
    this.postProductBuying(params).subscribe(
      () => {
        alert('Payment was success');
        this.router.navigate(['home/shopping']);
      },
      (error) => {
        alert('Payment was failer');
      }
    );
  }

  async getDefaultAddress() {
    this.addressLoading = true;
    let url = environment.server+'/ZKart/DefaultAddressBook';
    let data = await firstValueFrom(this.http.get<any[]>(url));
    this.selectedAddress = data[0];
    this.tempSelectedAddress = data[0];
    this.addressLoading = false;
  }

  async addressChange() {
    this.addressLoading = true;

    await this.getAddressDetails();
    this.addressLoading = false;
    this.isSelectAddress = true;
  }

  async getAddressDetails() {
    let url = environment.server+'/ZKart/AddressBook';

    const data = await firstValueFrom(this.http.get<any[]>(url));
    this.addressDetailsList = data;
    this.selectedAddress = this.addressDetailsList.filter((d: { id: any }) => {
      return d.id == this.selectedAddress.id;
    })[0];
    this.tempSelectedAddress = this.selectedAddress;
  }
  addNewAddress() {
    this.router.navigate(['/home/account/addresscarts/add']);
  }
  saveAddress(){
    this.selectedAddress = this.addressDetailsList.filter((d: { id: any }) => {
      return d.id == this.tempSelectedAddress.id;
    })[0];
    this.isSelectAddress=false;
  }
}
