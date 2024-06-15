import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [
    MatSelectModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './add-review.component.html',
  styleUrl: './add-review.component.css',
})
export class AddReviewComponent {
  id: number = NaN;
  rating = {
    options: [1, 2, 3, 4, 5],
  };
  routeAction = '';
  reviewId: number = NaN;
  reviewDetails: any = {};
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  reviewForm = new FormGroup({
    rating: new FormControl(1),
    comment: new FormControl('', [
      Validators.required,
      this.commentValidator(),
    ]),
  });

  async ngOnInit() {
    this.route.data.subscribe(async (data: any) => {
      this.routeAction = data.action;
      if (this.routeAction === 'editreview') {
        this.reviewId = this.route.snapshot.params['id'];
        this.route.queryParams.subscribe(params => {
          this.id = params['productId'];
        });
        await this.getReviewDetails();
      } else if (this.routeAction === 'addreview') {
        this.id = this.route.snapshot.params['id'];

      }
    });
  }

  formValidator(): any {
    return (control: FormControl) => {
      const fromPattern = /^[0-9]{1,8}$/;
      const isValid = fromPattern.test(control.value);
      return false;
    };
  }
  commentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const commentPattern = /^[a-zA-Z\s]{2,200}$/;
      const isValid = commentPattern.test(control.value);
      return isValid ? null : { invalidMessage: true };
    };
  }

  async reviewSubmit() {
    if (this.reviewForm.valid) {
      if (this.routeAction == 'addreview') {
        await this.addReview();
      } else {
        await this.editReview();
      }
    }
  }
  async getReviewDetails() {
    let url = 'http://localhost:8080/ZKart/FetchCustomerReview';
    let params = new HttpParams()
      .set('actionType', 'single')
      .set('id', this.reviewId)
      .set("productid",this.id);
    let data = await firstValueFrom(this.http.get<any[]>(url, { params }));
    this.reviewDetails = data[0];
    this.reviewForm.get('comment')?.setValue(this.reviewDetails?.comment);
    this.reviewForm.get('rating')?.setValue(this.reviewDetails?.star);
  }
  async editReview() {
    let url = 'http://localhost:8080/ZKart/Reviews';
    let params = new HttpParams()
      .set('productId', this.id)
      .set('comment', this.reviewForm.get('comment')?.value || '')
      .set('star', this.reviewForm.get('rating')?.value || 1)
      .set('reviewId', this.reviewId);
    const body = params.toString();
    const data = await firstValueFrom(
      this.http.put(url, body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
        responseType: 'text',
      })
    );
    alert('Review Edited Successfully');
    this.router.navigate(['/home/shopping']);
  }
  async addReview() {
    let url = 'http://localhost:8080/ZKart/Reviews';
    let params = new HttpParams()
      .set('productId', this.id)
      .set('comment', this.reviewForm.get('comment')?.value || '')
      .set('star', this.reviewForm.get('rating')?.value || 1);
    const data = await firstValueFrom(
      this.http.post(url, params, {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
        responseType: 'text',
      })
    );
    alert('Review added Successfully');
    this.router.navigate(['/home/shopping']);
  }
}
