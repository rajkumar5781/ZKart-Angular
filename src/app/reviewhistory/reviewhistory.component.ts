import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { formatDateString } from '../utils/date-utils';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reviewhistory',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    StarRatingComponent,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './reviewhistory.component.html',
  styleUrl: './reviewhistory.component.css',
})
export class ReviewhistoryComponent {
  constructor(private http: HttpClient, private router: Router) {}

  reviewDetails: any = [];
  loading = false;
  customerDetails: any = {};

  async ngOnInit() {
    this.loading = true;
    await this.getCustomerDetails();
    await this.getReviewDetails();
    this.loading = false;
  }

  async getReviewDetails() {
    let data = await firstValueFrom(
      this.http.get<any>('http://localhost:8080/ZKart/FetchCustomerReview')
    );
    this.reviewDetails = data;
  }
  async getCustomerDetails() {
    let data = await firstValueFrom(
      this.http.get<any[]>('http://localhost:8080/ZKart/customerDetail')
    );
    this.customerDetails = data[0];
  }
  formatDate(val: string) {
    return formatDateString(val);
  }

  editReview(review : any) {
    
    this.router.navigate(['/home/shopping/editreview', review.id],{ 
      queryParams: { 
        productId: review.productid,
      } 
    });

    // this.router.navigate(['/home/shopping/editreview', this.reviewId],{ 
    //   queryParams: { 
    //     productId: this.id,
    //   } 
    // });
  }
  async deleteReview(id: number) {
    let url = 'http://localhost:8080/ZKart/Reviews';
    let params = new HttpParams().set('reviewId', id);
    try {
      const data = await firstValueFrom(
        this.http.delete<any[]>(url, {
          params: params,
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          responseType: 'text' as 'json', // Ensure proper response type
        })
      );
      this.getReviewDetails()
    } catch (e:any) {
      alert(e.error());
      console.log(e);
    }
  }
}
