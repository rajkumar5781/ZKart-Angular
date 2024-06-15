import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { checkAuthentication } from '../auth.guard';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-product-cart',
  standalone: true,
  imports: [MatProgressSpinnerModule,CommonModule,StarRatingComponent],
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.css',
})
export class ProductCartComponent implements OnChanges {
  @Output() productClicked = new EventEmitter<number>();

  constructor(private http: HttpClient, private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productDetails']) {
      this.deserializeProductDetails();
    }
  }
  @Input() productDetails: any;
  description = '';
  discountPrice = 0;
  price = 0;
  count = 0;
  category = '';
  discount = 0;
  star = 5;
  id = 0;
  likes = 0;
  name = '';
  image = '';
  addToCartloading = false;
  rating_count = 0;
  ngOnInit() {
    this.deserializeProductDetails();
  }
  deserializeProductDetails() {
    let {
      Actual_price,
      Available_count,
      Category,
      Description,
      Discounts,
      Likes,
      Name,
      Star,
      id,
      Product_image,
      rating_count,
    } = this.productDetails || {};
    this.description = Description;
    this.discountPrice = Math.round(
      Actual_price - Actual_price * (Discounts / 100)
    );
    this.price = Actual_price;
    this.count = Available_count;
    this.category = Category;
    this.discount = Discounts;
    this.likes = Likes;
    this.name = Name;
    this.star = Star || 5;
    this.id = id;
    this.image = Product_image;
    this.rating_count = rating_count || 0;
  }
  clickedProduct() {
    this.productClicked.emit(this.id);
  }

  async addToCart(event: Event) {
    event.stopPropagation();
    if (!checkAuthentication()) {
      this.router.navigate(['/signin']);
      return;
    }
    this.addToCartloading = true;
    let params = new HttpParams()
      .set('productId', this.id)
      .set('product', this.name)
      .set('productCount', 1)
      .set('productPrice', this.price)
      .set('image', this.image);
    await firstValueFrom(
      this.http.post('http://localhost:8080/ZKart/AddToCards', params, {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
        responseType: 'text',
      })
    );
    this.addToCartloading = false;
  }
}
