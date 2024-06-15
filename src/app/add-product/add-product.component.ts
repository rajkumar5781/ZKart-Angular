import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormsModule,
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { allOnlyNumber, validator } from '../utils/inputValidationUtils';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent {
  productForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      validator(/^[a-zA-Z\s]{2,20}$/),
    ]),
    category: new FormControl('', [
      Validators.required,
      validator(/^[a-zA-Z\s]{2,20}$/),
    ]),
    discount: new FormControl(''),
    count: new FormControl('', [
      Validators.required,
      validator(/^[0-9]{1,10}$/),
    ]),
    description: new FormControl('', [
      Validators.required,
      validator(/^[a-zA-Z\s]{10,100}$/),
    ]),
    price: new FormControl('', [
      Validators.required,
      validator(/^[0-9]{1,10}$/),
    ]),
  });
  categoryOptions: any = [];
  imageSrc: string | ArrayBuffer | null = '';
  uploadedImage: File | undefined;
  routeAction = '';
  productId : any  = NaN;
  productDetails : any;

  constructor(private http: HttpClient,private router:Router,private route : ActivatedRoute) {}

  async ngOnInit() {
    this.route.data.subscribe(async (data: any) => {
      this.routeAction = data.action;
      if (this.routeAction === 'editproduct') {
        this.productId = this.route.snapshot.params['id'];
        this.route.queryParams.subscribe(params => {
        });
        await this.getProductDetails();
      } else if (this.routeAction === 'addproduct') {
        // this.id = this.route.snapshot.params['id'];

      }
    });
  }

  formSubmit(){
    if(this.routeAction === 'editproduct'){
      this.updateProduct();
    }
    else{
      this.addProduct();
    }
  }

  async addProduct() {
    if (!this.productForm.valid) {
      if (this.imageSrc == '') {
        alert('Please choose the product image');
      }
      return;
    }
    let url = 'http://localhost:8080/ZKart/Product';
    let params = new HttpParams().set("Name",this.productForm.get("name")?.value || "");
    params = params.set("Description",this.productForm.get("description")?.value || "");
    params = params.set("Category",this.productForm.get("category")?.value || "");
    params = params.set("Actual_price",this.productForm.get("price")?.value || "");
    params = params.set("Discounts",this.productForm.get("discount")?.value || "");
    params = params.set("productCount",this.productForm.get("count")?.value || "");
    params = params.set("Likes",0);

    const formData = new FormData();
    if (this.uploadedImage != null) {
      formData.append('image', this.uploadedImage);
    }
    try {
      const data = await firstValueFrom(
        this.http.post(url, formData,{ params , responseType: 'text'})
      );
      setTimeout(()=>{
        this.router.navigate(['/home/dashboard']);
      },500);
    } catch (e) {
      console.log(e);
    }
  }

  allowStringOnly(event: KeyboardEvent): void {
    const isCharacter = /^[a-zA-Z]+$/.test(event.key);
    if (!isCharacter) {
      event.preventDefault();
    }
  }

  allOnlyNumbers(event: KeyboardEvent) {
    allOnlyNumber(event);
  }

  async fetchCategory() {
    let url = 'http://localhost:8080/ZKart/FetchCategorys';
    let data = await firstValueFrom(this.http.get<any[]>(url));
    this.categoryOptions = data;
  }

  getImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      this.uploadedImage = input.files[0];
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imageSrc = e.target?.result ?? null;
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  async getProductDetails(){
    let url = 'http://localhost:8080/ZKart/Product';

    let params = new HttpParams().set("id",this.productId);

    const data = await firstValueFrom(this.http.get<any[]>(url,{ params }));

    this.productDetails = data[0];
    if(this.productDetails!=null){
      this.productForm.get("name")?.setValue(this.productDetails?.Name || '');
      this.productForm.get("description")?.setValue(this.productDetails?.Description || '');
      this.productForm.get("category")?.setValue(this.productDetails?.Category || '');
      this.productForm.get("price")?.setValue(this.productDetails?.Actual_price || '');
      this.productForm.get("discount")?.setValue(this.productDetails?.Discounts || '');
      this.productForm.get("count")?.setValue(this.productDetails?.Available_count || '');
      this.imageSrc = "http://localhost:8080/ZKart/ViewImages?file_name="+this.productDetails?.Product_image;
    }
  }

  async updateProduct() {
    const url = "http://localhost:8080/ZKart/Product";
    const formData = new FormData();
    formData.append("Name", this.productForm.get("name")?.value || "");
    formData.append("Description", this.productForm.get("description")?.value || "");
    formData.append("Category", this.productForm.get("category")?.value || "");
    formData.append("Actual_price", this.productForm.get("price")?.value || "");
    formData.append("Discounts", this.productForm.get("discount")?.value || "");
    formData.append("productCount", this.productForm.get("count")?.value || "");
    formData.append("Likes", this.productForm.get("likes")?.value || "0");
    formData.append("id",this.productId);
    if (this.uploadedImage != null) {
      formData.append('image', this.uploadedImage);
    }
    const data = await firstValueFrom(
      this.http.put(url, formData, {
        responseType: 'text',
      })
    );
  }
  
}
