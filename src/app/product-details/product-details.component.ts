import {
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ProductBuyComponent } from '../product-buy/product-buy.component';
import { ProductInterface } from '../product-interface';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [MatButtonModule,CommonModule,ProductBuyComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
  schemas: [NO_ERRORS_SCHEMA] 
})
export class ProductDetailsComponent {
  id: number = -1;
  productDetails:any;
  description = "";
  discountPrice : number = 0;
  price = 0;
  count = 0;
  category = "";
  discount = 0;
  star = 0;
  likes = 0;
  name = "";
  image = "";
  selectTotalproductCount = 1;
  isShow = true;
  productList: ProductInterface[] = [];
  constructor(private route: ActivatedRoute, private http: HttpClient,private router : Router) {}

  private checkAuthentication(): boolean {
    return typeof localStorage !== 'undefined' && localStorage.getItem('isAuthenticated') !== null;
  }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.id = idParam !== null ? +idParam : 0; 
    });
    if(this.id!=0){
      this.getProductDetails();
    }
  }
  getProductDetails() {
    let params = new HttpParams().set('id', this.id);
      this.http.get("http://localhost:8080/ZKart/productDetails",{ params: params }).subscribe((data)=>{
      this.productDetails = data;
      let { Actual_price, Available_count, Category, Description, Discounts, Likes, Name, Star, id,Product_image } = this.productDetails || {};
      this.description = Description;
      this.discountPrice = Math.round(Actual_price - ((Actual_price) * (Discounts / 100)));
      this.price = Actual_price;
      this.count = Available_count;
      this.category = Category;
      this.discount = Discounts;
      this.likes = Likes;
      this.name = Name;
      this.star = Star;
      this.image = Product_image;
    })
  }
  decreseCount(){
    if (this.selectTotalproductCount > 1) {
        this.selectTotalproductCount = this.selectTotalproductCount - 1;
    }
  }
  increseCount(){
    if (this.selectTotalproductCount < this.count) {
      this.selectTotalproductCount = this.selectTotalproductCount + 1;
  }
  }
  addToCart(){
    if(!this.checkAuthentication()){
      this.router.navigate(['/signin']);
    }
    let userId : any = localStorage.getItem("userId");
    let params = new HttpParams().set('productId', this.id).set("product", this.name).set('productCount',this.selectTotalproductCount).set('productPrice',this.price).set('image',this.image).set('customerId',userId);

    this.http.post("http://localhost:8080/ZKart/AddToCards",params,{
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),responseType:"text"
    }).subscribe((d) => {
      console.log(d);
    })
  }
  shopNow(){
    this.isShow = !this.isShow;
    this.productList.push({image:this.image,price:this.discountPrice,name:this.name,quantity:this.selectTotalproductCount,total:(this.discountPrice*this.selectTotalproductCount),id:this.id})
  }
}
