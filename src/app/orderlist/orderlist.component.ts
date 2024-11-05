import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { environment } from '../../../enviroment';

interface Order {
  Name: string;
  Description: string;
  Category: string;
  Actual_price: number;
  Discounts: number;
  productCount: number;
  Likes: number;
}

@Component({
  selector: 'app-orderlist',
  standalone: true,
  imports: [MatProgressSpinnerModule,CommonModule,MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './orderlist.component.html',
  styleUrl: './orderlist.component.css'
})
export class OrderlistComponent {

  orderedDetails : any = [];
  dataSource: MatTableDataSource<Order> = new MatTableDataSource<Order>([]);
  isLoading = false;
  isError = false;
  displayedColumns: string[] = ['Order Id','Name','Price','Quantity'];

  constructor(private http : HttpClient){}

  ngOnInit(){
     this.fetchOrdersList();
  }

  async fetchOrdersList(){
    try{
    this.isError = false;
    this.isLoading =true;
    this.orderedDetails = [];
    let url = environment.server+'/ZKart/TotalOrders';

    const data = await firstValueFrom(this.http.get<Order[]>(url));
    this.orderedDetails = data;
    this.dataSource.data = this.orderedDetails;
    this.isLoading =false;
    }
    catch(e : any){
      alert(e.error());
      this.isLoading = false;
      this.isError=true;
    }
  }

}
