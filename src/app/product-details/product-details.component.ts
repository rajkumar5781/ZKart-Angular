import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  id: number = -1;
  productDetails:any;
  description = "";
  discountPrice = 0;
  price = 0;
  count = 0;
  category = "";
  discount = 0;
  star = 0;
  likes = 0;
  name = "";
  image = "";
  selectTotalproductCount = 1;
  constructor(private route: ActivatedRoute, private http: HttpClient) {}
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
}
