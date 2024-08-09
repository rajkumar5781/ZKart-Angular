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
import { ProductReviewsComponent } from '../product-reviews/product-reviews.component';
import { ProductquntitycounterComponent } from '../productquntitycounter/productquntitycounter.component';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../enviroment';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [MatButtonModule,CommonModule,ProductBuyComponent,ProductReviewsComponent,ProductquntitycounterComponent],
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
  reviewButtonText = "Add";
  selectTotalproductCount = 1;
  isShow = true;
  productList: ProductInterface[] = [];
  showReviewDetails = false;
  isNew = true;
  isEdit = false;
  invalid = true;
  reviewId = "";
  constructor(private route: ActivatedRoute, private http: HttpClient,private router : Router) {}

  private checkAuthentication(): boolean {
    return typeof sessionStorage !== 'undefined' && sessionStorage.getItem('isAuthenticated') !== null;
  }
 async ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.id = idParam !== null ? +idParam : 0; 
    });
    if(this.id!=0){
      this.getProductDetails();
    }
    await this.checkValideReviewer();
  }
  getProductDetails() {
    let params = new HttpParams().set('id', this.id);
      this.http.get(environment.server+"/ZKart/productDetails",{ params: params }).subscribe((data)=>{
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
  async addToCart(){
    if(!this.checkAuthentication()){
      this.router.navigate(['/signin']);
    }
    let params = new HttpParams().set('productId', this.id).set("product", this.name).set('productCount',this.selectTotalproductCount).set('productPrice',this.discountPrice).set('image',this.image);

    this.http.post(environment.server+"/ZKart/AddToCards",params,{
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),responseType:"text"
    }).subscribe((d) => {
      console.log(d);
    })
  }
  async checkValideReviewer(){
    let url = environment.server+"/ZKart/ValidateReviews";
    let params = new HttpParams().set("productId",this.id);
    let data = await firstValueFrom(this.http.get<any>(url, { params }))
    if(data.buy && !data.review){
      this.isNew = true;
      this.invalid = false;
      this.isEdit = false;
    }
    if(data.buy && data.review){
      this.isNew = false;
      this.invalid = false;
      this.isEdit = true;
      this.reviewId = data.reviewId;
    }
    if(!data.buy){
      this.invalid = true;
    }
    return data;
  }
  shopNow(){
    if(this.checkAuthentication()){
    this.isShow = !this.isShow;
    this.productList.push({image:this.image,price:this.discountPrice,name:this.name,quantity:this.selectTotalproductCount,total:(this.discountPrice*this.selectTotalproductCount),id:this.id})
    // this.router.navigate(['/'])
    // this.router.navigate(['home/shopping/product/buy', this.id],{ queryParams: { quantity: this.selectTotalproductCount } });
    }
    else{
      this.router.navigate(['/signin']);
    }
  }
  readReview(){
    this.showReviewDetails = true;
  }
  async addReview(){
    if(this.isEdit){
      this.router.navigate(['/home/shopping/editreview', this.reviewId],{ 
        queryParams: { 
          productId: this.id,
        } 
      });
    }
    else{
      this.router.navigate(['/home/shopping/addreview',this.id]);
    }
  }
  totalValueChanged(newValue: number){
    this.selectTotalproductCount = newValue;
  }
}
