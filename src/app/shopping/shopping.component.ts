import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ProductCartComponent } from '../product-cart/product-cart.component';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';
import { FilterComponent } from '../filter/filter.component';

interface ModuleMeta {
  dv: string;
  value: any; // Change `any` to a more specific type if possible
  isChecked: boolean;
}

@Component({
  selector: 'app-shopping',
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
  ],
  templateUrl: './shopping.component.html',
  styleUrl: './shopping.component.css',
})
export class ShoppingComponent {
  currentPage = 1;
  searchWord = '';
  datas: any;
  totalCount: number | undefined;
  timeout: any;
  isValid = true;
  moduleMetaList: any[] = [];
  moduleName = 'Products';
  searchValues :any = {};

  constructor(
    private router: Router,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
      }
    });
  }

  ngOnInit() {

    if(this.activatedRoute.snapshot.queryParams['json']!=null){
    this.searchValues = JSON.parse(this.activatedRoute.snapshot.queryParams['json']);
    }
    this.getProductDetails();
    this.getProductCount();
    this.getModuleMeta();
    this.setValues();
  }

  getProductDetails() {
    let params = new HttpParams()
      .set('searchWord', this.searchWord)
      .set('pageNumber', this.currentPage);
    this.http
      .get('http://localhost:8080/ZKart/ProductList', { params: params })
      .subscribe((data) => {
        this.datas = data;
      });
  }
  getProductCount() {
    let params = new HttpParams().set('searchWord', this.searchWord);
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
    clearTimeout(this.timeout); // Clear previous timeout
    this.timeout = setTimeout(() => {
      this.getProductCount();
      this.getProductDetails();
    }, 200);
  }
  productItemClicked(productDetails: any) {
    const queryParams : any = {
      json: JSON.stringify({
        name: 'rajkumar',
        price:[10,20],
        likes:10
      }) 
    };

    const navigationExtras = {
      queryParams:queryParams
    };

    this.router.navigate(['home/shopping/product', productDetails],navigationExtras);
  }
  getModuleMeta() {
    let params = new HttpParams().set('module', this.moduleName);
    this.http
      .get('http://localhost:8080/ZKart/fieldDetails', { params })
      .subscribe((data: any) => {
        this.moduleMetaList = data;
      });
  }
  setValues(){
    console.log(this.searchValues);
    const tempMetaList = this.moduleMetaList.map((d) => {
      console.log(d.dv,this.searchValues['price']);
      if (this.searchValues[d.dv] != null) {
        return {
          ...d,
          value: this.searchValues[d.dv],
          isChecked: true
        };
      } else {
        return {
          ...d,
          value: [],
          isChecked: false
        };
      }
    });
    this.moduleMetaList = tempMetaList;
  }
}


