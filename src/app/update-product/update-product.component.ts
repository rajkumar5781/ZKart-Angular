import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ProductCartComponent } from '../product-cart/product-cart.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { UpdateProductCartsComponent } from '../update-product-carts/update-product-carts.component';
import { FilterComponent } from '../filter/filter.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [
    ProductCartComponent,
    MatPaginatorModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    RouterOutlet,
    FilterComponent,
    UpdateProductCartsComponent,
  ],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent {
  currentPage: number = 1;
  searchWord = '';
  datas: any = [];
  totalCount: number | undefined;
  timeout: any;
  isValid = true;
  moduleMetaList: any[] = [];
  moduleName = 'Products';
  searchValues: any = {};

  constructor(
    private router: Router,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
      }
    });
    this.activatedRoute.queryParams.subscribe((p) => {
      if (this.activatedRoute.snapshot.queryParams['search'] != null) {
        this.currentPage = 1;
        this.getSearcgQuery();
        this.setValues();
        this.getProductDetails();
        this.getProductCount();
      }
    });
  }

  ngOnInit() {
    this.currentPage = 1;
    this.getProductDetails();
    this.getProductCount();
    this.getModuleMeta();
    this.setValues();
  }
  getSearcgQuery() {
    if (this.activatedRoute.snapshot.queryParams['search'] != null) {
      this.searchValues = JSON.parse(
        this.activatedRoute.snapshot.queryParams['search']
      );
    }
  }
  getProductDetails() {
    let params = new HttpParams();
    params = params.append('searchWord', this.searchWord);
    params = params.append('pageNumber', this.currentPage);
    if (this.searchValues != null) {
      Object.keys(this.searchValues || []).forEach((key) => {
        const value = this.searchValues[key];
        params = params.append(key, value);
      });
    }
    this.http
      .get('http://localhost:8080/ZKart/ProductList', { params: params })
      .subscribe((data) => {
        this.datas = data;
      });
  }
  getProductCount() {
    let params = new HttpParams();
    params = params.append('searchWord', this.searchWord);
    if (this.searchValues != null) {
      Object.keys(this.searchValues || []).forEach((key) => {
        const value = this.searchValues[key];
        params = params.append(key, value);
      });
    }
    this.http
      .get('http://localhost:8080/ZKart/ProductCount', { params: params })
      .subscribe((data: any) => {
        this.totalCount = data.count;
      });
  }
  handlePageEvent(e: PageEvent) {
    this.currentPage = e.pageIndex + 1;
    this.getProductDetails();
  }
  trackByName(index: number, item: any): string {
    return item.name;
  }
  searchWordFunction() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.currentPage = 1;
      this.getProductCount();
      this.getProductDetails();
    }, 200);
  }
  productItemClicked(productDetails: any) {
    // this.router.navigate(['home/ecommerce/updateproduct/edit', productDetails]);
    this.router.navigate(['edit', productDetails], { relativeTo: this.activatedRoute });
  }
  getModuleMeta() {
    let params = new HttpParams().set('module', this.moduleName);
    this.http
      .get('http://localhost:8080/ZKart/fieldDetails', { params })
      .subscribe((data: any) => {
        this.moduleMetaList = data;
      });
  }
  setValues() {
    const tempMetaList = this.moduleMetaList.map((d) => {
      if (this.searchValues[d.name] != null) {
        return {
          ...d,
          value: this.searchValues[d.name],
          isChecked: true,
        };
      } else {
        return {
          ...d,
          value: [0, 0],
          isChecked: false,
        };
      }
    });
    this.moduleMetaList = tempMetaList;
  }

  async deleteAddressCart(id: number) {
    let params = new HttpParams().set('id', id);
    let url = 'http://localhost:8080/ZKart/AddressBook';
    try {
       await firstValueFrom(
        this.http.delete<any[]>(url, {
          params: params,
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          responseType: 'text' as 'json', // Ensure proper response type
        })
      );
    }
    catch(e:any){
      alert(e.error);
    }
  }

  async deleteProduct(productDetails: any){
    let params = new HttpParams().set('id', productDetails);
    let url = 'http://localhost:8080/ZKart/Product';
    try {
       await firstValueFrom(
        this.http.delete<any[]>(url, {
          params: params,
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          responseType: 'text' as 'json',
        })
      );
      this.getProductCount();
      this.getProductDetails();
    }
    catch(e : any){
      alert(e.error());
    }
  }
}
