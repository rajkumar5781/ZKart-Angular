import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, firstValueFrom, map } from 'rxjs';
import { ProductBuyComponent } from '../product-buy/product-buy.component';
import {  Router } from '@angular/router';
import { ProductInterface } from '../product-interface';
import { ProductquntitycounterComponent } from '../productquntitycounter/productquntitycounter.component';

@Component({
  selector: 'app-add-to-cart',
  standalone: true,
  imports: [CommonModule,ProductBuyComponent,ProductquntitycounterComponent],
  templateUrl: './add-to-cart.component.html',
  styleUrl: './add-to-cart.component.css',
})
export class AddToCartComponent {
  totalPrice$: Observable<number>;
  isShow = true;
  productList :ProductInterface[] =[];
  isUpdating = false;
  constructor(private http: HttpClient,private router : Router) {
    this.totalPrice$ = this.addToCartList$.pipe(
      map(addToCartList => 
        addToCartList.reduce(
          (acc: number, item: { productPrice: number; productCount: number; }) => acc + (item.productPrice * item.productCount), 
          0
        )
      )
    );
  }

  private addToCartListSubject = new BehaviorSubject<any>([]);
  addToCartList$: Observable<any> = this.addToCartListSubject.asObservable();


  isAvailableAddToCart$: Observable<boolean> = this.addToCartList$.pipe(
    map(list => list.length > 0)
  );

  userId: any;
  moduleName = "cart";
  addToCartList :any = [];

   ngOnInit() {
    this.getAddToCartDetail();
  }

  async getAddToCartDetail() {
    this.http.get("http://localhost:8080/ZKart/LoadAddToCartDetails").subscribe((data)=>{
      this.addToCartListSubject.next(data);
  })
  }
  goToShopping(){
    this.router.navigate(['/home/shopping']);
  }
  buyNow(){
    (this.addToCartList$).forEach((data)=>{
      data.forEach((d: { productImage: any; productPrice: number; productName: any; productCount: number; id: any; })=>{
        this.productList.push({image:d.productImage,price:d.productPrice,name:d.productName,quantity:d.productCount,total:(d.productPrice*d.productCount),id:d.id});
      })
    })
    this.isShow=false;
  }

 async totalValueChanged(newValue: number,id:number,actionType : string,product : any){
    try{
      this.isUpdating = true;
      let url = "http://localhost:8080/ZKart/UpdateAddToCart";
      let params = new HttpParams().set('id', id).set("actionType",actionType);
      if(actionType=="update"){
        product.productCount = newValue;
        params = params.set("count",newValue);
      }
      await firstValueFrom(
        this.http.post(url, params, {
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          responseType: 'text',
        })
      );
      this.isUpdating = false;
      if(actionType=="delete"){
        this.getAddToCartDetail();
      }
    }
    catch(e){
      console.log(e);
    }
  }
}
