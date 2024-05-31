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
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient,private router:Router) {}

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
        console.log("sjsjsj");
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
}
