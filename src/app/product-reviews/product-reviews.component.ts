import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule,StarRatingComponent,MatIconModule],
  templateUrl: './product-reviews.component.html',
  styleUrl: './product-reviews.component.css'
})
export class ProductReviewsComponent {

  @Input() id : number = -1;
  productReviewDetails : any[] = [];

  constructor(private http:HttpClient){}

  async ngOnInit(){
    this.getproductReviews();
  }

  getproductReviews(){
    let params = new HttpParams().set('productId', this.id);
    this.http.get<any[]>("http://localhost:8080/ZKart/Reviews",{params:params}).subscribe((data)=>{
    this.productReviewDetails = data;
    })
  }
}
