import { Component, SimpleChanges } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { dateISOToFormatString } from '../utils/date-utils';
import { MatChipsModule } from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';

interface Order {
  description: string;
  id: number;
  orderid: number;
  address: JSON;
  products: JSON[];
  fromAddress: JSON;
}

@Component({
  selector: 'app-customer-order-list',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './customer-order-list.component.html',
  styleUrl: './customer-order-list.component.css',
})
export class CustomerOrderListComponent {
  isLoading: boolean = false;
  isError: boolean = false;
  orderedDetails: any = [];
  dataSource: MatTableDataSource<Order> = new MatTableDataSource<Order>([]);
  displayedColumns: string[] = [
    'Order Id',
    'From',
    'To',
    'Time',
    'Price',
    'Status',
    'star'
  ];
  totalPrice: number = NaN;

  constructor(private http: HttpClient,private router : Router) {}

  ngOnInit() {
    this.fetchOrdersList();
  }

  async fetchOrdersList() {
    try {
      this.isError = false;
      this.isLoading = true;
      this.orderedDetails = [];
      let url = 'http://localhost:8080/ZKart/OrderDetailsList';

      const data = await firstValueFrom(this.http.get<Order[]>(url));
      this.orderedDetails = data;
      this.dataSource.data = this.orderedDetails;
      this.isLoading = false;
    } catch (e: any) {
      alert(e.error());
      this.isLoading = false;
      this.isError = true;
    }
  }

  getStartTime(value: string) {
    return dateISOToFormatString(value);
  }

  getPrice(data: { products: any }) {
    return data.products.reduce((total: number, price: number) => {
      return total + price;
    }).price;
  }

  readyForShipping(value: any) {
    if (
      value.process.processtime != null &&
      value.process.receivetime == '' &&
      value.process.delivertime == ''
    ) {
      return true;
    }
    return false;
  }

  transmit(value: any) {
    if (
      value.process.processtime != null &&
      value.process.receivetime != "" &&
      value.process.receivetime != null &&
      value.process.delivertime == ''
    ) {
      return true;
    }
    return false;
  }
  delivered(value: any) {
    if (
      value.process.processtime != null &&
      value.process.receivetime != null &&
      value.process.delivertime !='' &&
      value.process.delivertime != null
    ) {
      return true;
    }
    return false;
  }

  goToTrackOrder(value : any){
    this.router.navigate(['/home/account/orderlist/ordertracking',value.orderid]);
  }

  async cancelOrder(value : any){
    let params = new HttpParams().set('orderid', value.orderid);
    let url = 'http://localhost:8080/ZKart/ProductBuying';
    try {
       await firstValueFrom(
        this.http.delete<any[]>(url, {
          params: params,
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          responseType: 'text' as 'json', // Ensure proper response type
        })
      );
      this.fetchOrdersList();
    } catch (e) {
      console.log(e);
      alert(e);
    }
  }
}
