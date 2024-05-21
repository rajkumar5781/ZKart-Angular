import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-product-cart',
  standalone: true,
  imports: [],
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.css'
})


export class ProductCartComponent implements OnChanges {

  @Output() productClicked = new EventEmitter<number>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productDetails']) {
      this.deserializeProductDetails();
    }
  }
  @Input() productDetails: any
  description = "";
  discountPrice = 0;
  price = 0;
  count = 0;
  category = "";
  discount = 0;
  star = 0;
  id = 0;
  likes = 0;
  name = "";
  image = "";
  ngOnInit() {
    this.deserializeProductDetails();
  }
  deserializeProductDetails() {
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
    this.id = id;
    this.image = Product_image;
  }
  clickedProduct() {
    this.productClicked.emit(this.id);
  }
}


