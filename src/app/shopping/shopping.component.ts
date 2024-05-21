import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ProductCartComponent } from '../product-cart/product-cart.component';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [ProductCartComponent,MatPaginatorModule,CommonModule,MatInputModule,MatFormFieldModule,FormsModule,RouterOutlet],
  templateUrl: './shopping.component.html',
  styleUrl: './shopping.component.css'
})
export class ShoppingComponent {
  currentPage = 1;
  searchWord="";
  datas : any;
  totalCount : number | undefined;
  timeout:any;
  isValid=true;
  
  constructor(private router: Router,private http:HttpClient,private location: Location){
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // this.getLastSegment();
      }
    });
  }

  ngOnInit(){
    this.getProductDetails();
    this.getProductCount();
  }
  
  getProductDetails(){
    let params = new HttpParams().set('searchWord', this.searchWord).set('pageNumber', this.currentPage);
    this.http.get("http://localhost:8080/ZKart/ProductList",{ params: params }).subscribe((data)=>{
      this.datas = data;
    })
  }
  getProductCount(){
    let params = new HttpParams().set('searchWord', this.searchWord);
    this.http.get("http://localhost:8080/ZKart/ProductCount",{ params: params }).subscribe((data : any)=>{
      this.totalCount = data.count;
    })
  }
  handlePageEvent(e: PageEvent) {
    this.currentPage = e.pageIndex+1;
    this.getProductDetails();
  }
  trackByName(index: number, item: any): string {
    return item.name;
  }
  searchWordFunction(){
    clearTimeout(this.timeout); // Clear previous timeout
    this.timeout = setTimeout(() => {
      this.getProductCount();
      this.getProductDetails();
    }, 200);
  }
  productItemClicked(productDetails: any){
    this.router.navigate(['home/shopping/product', productDetails]);
  }
}


