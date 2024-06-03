import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, firstValueFrom, map } from 'rxjs';
import {  Router } from '@angular/router';
import { ProductInterface } from '../product-interface';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-orderhistory',
  standalone: true,
  imports: [CommonModule,MatProgressSpinnerModule],
  templateUrl: './orderhistory.component.html',
  styleUrl: './orderhistory.component.css'
})
export class OrderhistoryComponent {
  isShow = true;
  productList :ProductInterface[] =[];
  orderProductDetails : any = [];
  loading = true;
  constructor(private http: HttpClient,private router : Router) {

  }

  private addToCartListSubject = new BehaviorSubject<any>([]);
  addToCartList$: Observable<any> = this.addToCartListSubject.asObservable();


  isAvailableAddToCart$: Observable<boolean> = this.addToCartList$.pipe(
    map(list => list.length > 0)
  );

  userId: any;
  moduleName = "cart";
  addToCartList :any = [];

  async ngOnInit() {
  this.loading = true;
   await this.getOrderDetails();
   this.loading = false;
  }
  async getOrderDetails(){
    if(typeof localStorage !== 'undefined'){
      this.userId = localStorage.getItem('userId');
      let params = new HttpParams().set('customerId', this.userId);
      let data = await firstValueFrom(this.http.get("http://localhost:8080/ZKart/ProductBuying",{ params: params }));
      this.orderProductDetails = data;
      }
  }
}
