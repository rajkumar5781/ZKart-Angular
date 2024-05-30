import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-addressbookform',
  standalone: true,
  imports: [
    MatFormFieldModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './addressbookform.component.html',
  styleUrl: './addressbookform.component.css',
})
export class AddressbookformComponent {
  isSubmitting = false;
  indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Lakshadweep',
    'Puducherry',
  ];
  addressDetails : any;
  id:number = NaN;
  isCheckBoxDisable :any = false;

  addressForm = new FormGroup({
    postal: new FormControl('', [this.postalCodevalidator()]),
    phoneNumber: new FormControl('', [this.phoneNumberValidator()]),
    state: new FormControl('', [
      Validators.required,
      this.stateValidator(this.indianStates),
    ]),
    name: new FormControl('', [Validators.required, this.nameValidator()]),
    address: new FormControl('', [
      Validators.required,
      this.addressValidator(),
    ]),
    defaultAddress: new FormControl(false),
    city: new FormControl('', [Validators.required, this.cityValidator()]),
  });

  constructor(private http: HttpClient,private route: ActivatedRoute) {}

 async ngOnInit(){
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.id = idParam !== null ? +idParam : 0; 
    });
    if(this.id!=0){
     await this.fetchAddress();
     this.addressForm.get('name')?.setValue(this.addressDetails.name);
     this.addressForm.get('address')?.setValue(this.addressDetails.address);
     this.addressForm.get('city')?.setValue(this.addressDetails.city);
     this.addressForm.get('defaultAddress')?.setValue((this.addressDetails.default_address == "false"?false:true));
     this.addressForm.get('phoneNumber')?.setValue(this.addressDetails.mobile);
     this.addressForm.get('postal')?.setValue(this.addressDetails.postalCode);
     this.addressForm.get('state')?.setValue(this.addressDetails.state);
      this.isCheckBoxDisable = this.addressForm.get("defaultAddress")?.value;
    }
  }

  allowStringOnly(event: KeyboardEvent): void {
    const isCharacter = /^[a-zA-Z]+$/.test(event.key);
    if (!isCharacter) {
      event.preventDefault();
    }
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
    const isNumeric = /^[a-zA-Z0-9\s.,/]/.test(event.key);
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

  stateValidator(states: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedState = control.value;
      if (!selectedState || !states.includes(selectedState)) {
        return { invalidState: { value: selectedState } };
      }
      return null;
    };
  }

  addressValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const address = control.value;
      if (!address || address.length < 5) {
        return { invalidAddress: { value: address } };
      }
      return null;
    };
  }

  cityValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const city = control.value;
      if (!city || city.length < 5) {
        return { invalidCity: { value: city } };
      }
      return null;
    };
  }

  nameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const name = control.value;
      if (!name || name.length < 2) {
        return { invalidName: { value: name } };
      }
      return null;
    };
  }

  async saveAddress() {
    if (this.addressForm.valid) {
      this.isSubmitting = true;
     if(this.id==0){
      await this.addAddress();
     }
     else{
      await this.editAddress()
     }
     this.isSubmitting = false;
    }
  }

  async addAddress(){
      let params = new HttpParams();
      params = params
        .set('name', this.addressForm.get('name')?.value || '')
        .set('address', this.addressForm.get('address')?.value || '')
        .set('city', this.addressForm.get('city')?.value || '')
        .set('postalCode', this.addressForm.get('postal')?.value || '')
        .set('country', 'India')
        .set('mobile', this.addressForm.get('phoneNumber')?.value || '')
        .set('state', this.addressForm.get('state')?.value || '')
        .set('default', this.addressForm.get('defaultAddress')?.value || false)
        .set("actionType","add");

      let url = 'http://localhost:8080/ZKart/AddressBook';
      await firstValueFrom(
        this.http.post(url, params, {
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          responseType: 'text',
        })
      );
  }

  async editAddress(){
      let params = new HttpParams();
      params = params
        .set('name', this.addressForm.get('name')?.value || '')
        .set('address', this.addressForm.get('address')?.value || '')
        .set('city', this.addressForm.get('city')?.value || '')
        .set('postalCode', this.addressForm.get('postal')?.value || '')
        .set('country', 'India')
        .set('mobile', this.addressForm.get('phoneNumber')?.value || '')
        .set('state', this.addressForm.get('state')?.value || '')
        .set('default', this.addressForm.get('defaultAddress')?.value || false)
        .set("id",this.id)
        .set("actionType","edit");

      let url = 'http://localhost:8080/ZKart/AddressBook';
      await firstValueFrom(
        this.http.post(url, params, {
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          responseType: 'text',
        })
      );
  }

  async fetchAddress() {
    this.addressDetails = {};
    let url = 'http://localhost:8080/ZKart/CustomerSingleAddress';
    let params = new HttpParams().set('id', this.id);

    const data = await firstValueFrom(this.http.get<any>(url, { params }));
    this.addressDetails = data[0];
  }
}
