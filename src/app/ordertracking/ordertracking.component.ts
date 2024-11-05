import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { dateISOToFormatDataString } from '../utils/date-utils';
import {MatSnackBar} from '@angular/material/snack-bar';
import { environment } from '../../../enviroment';

@Component({
  selector: 'app-ordertracking',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './ordertracking.component.html',
  styleUrl: './ordertracking.component.css',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
})
export class OrdertrackingComponent {
  orderId: number = NaN;
  orderDetails: any;
  isLoading: boolean = false;
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: '',
  });
  isOptional = false;
environment: any = environment.server;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.route.data.subscribe(async (data: any) => {
      this.orderId = this.route.snapshot.params['id'];
    });
    this.getOrderDetails();
  }
  async getOrderDetails() {
    this.isLoading = true;
    let url = environment.server+'/ZKart/SingleOrderDetails';
    let params = new HttpParams().set('orderid', this.orderId);

    const data = await firstValueFrom(this.http.get<any[]>(url, { params }));
    this.orderDetails = data[0];
    this.isLoading = false;
  }

  getTime(value:any){
    return dateISOToFormatDataString(value);
  }

  openSnackBar(message: string, content: any) {
    if(message.length<1){
      message = "Copied";
    }
    navigator.clipboard.writeText(content);
    this._snackBar.open(message, '', {
      duration: 2000,
    });
  }
}
