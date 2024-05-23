import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ProductBuyComponent } from '../product-buy/product-buy.component';
import {  Router } from '@angular/router';
import { ProductInterface } from '../product-interface';

@Component({
  selector: 'app-add-to-cart',
  standalone: true,
  imports: [CommonModule,ProductBuyComponent],
  templateUrl: './add-to-cart.component.html',
  styleUrl: './add-to-cart.component.css',
})
export class AddToCartComponent {
  totalPrice$: Observable<number>;
  isShow = true;
  productList :ProductInterface[] =[];
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

  async ngOnInit() {
   await this.getAddToCartDetail();
  }

  async getAddToCartDetail() {
    if(typeof localStorage !== 'undefined'){
    this.userId = localStorage.getItem('userId');
    }
    let params = new HttpParams().set('customerId', this.userId);
    this.http.get("http://localhost:8080/ZKart/LoadAddToCartDetails",{ params: params }).subscribe((data)=>{
      this.addToCartListSubject.next(data);
  })
  }
  goToShopping(){
    this.router.navigate(['/home/shopping']);
  }
  buyNow(){



    // this.addToCartList$.pipe(
    //   forE(addToCartList => 
    //     addToCartList.reduce(
    //       (acc: number, item: { productPrice: number; productCount: number; }) => acc + (item.productPrice * item.productCount), 
    //       0
    //     )
    //   )
    // );



    (this.addToCartList$).forEach((data)=>{
      console.log(data);
      data.forEach((d: { productImage: any; productPrice: number; productName: any; productCount: number; id: any; })=>{
        console.log(d);
        this.productList.push({image:d.productImage,price:d.productPrice,name:d.productName,quantity:d.productCount,total:(d.productPrice*d.productCount),id:d.id});
      })
      // this.productList.push({image:data.image,price:data.discountPrice,name:data.name,quantity:data.selectTotalproductCount,total:(data.discountPrice*data.selectTotalproductCount),id:data.id});
    })
    console.log(this.productList);
    this.isShow=false;
  }
}
