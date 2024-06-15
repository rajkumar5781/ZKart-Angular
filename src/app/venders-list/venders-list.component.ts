// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-venders-list',
//   standalone: true,
//   imports: [],
//   templateUrl: './venders-list.component.html',
//   styleUrl: './venders-list.component.css'
// })
// export class VendersListComponent {

// }


import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

interface Users {
  name: string;
  lastName: string;
  phoneNumber: number;
}

@Component({
  selector: 'app-venders-list',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, MatTableModule],
  templateUrl: './venders-list.component.html',
  styleUrl: './venders-list.component.css'
})
export class VendersListComponent {
  isLoading = false;
  dataSource: MatTableDataSource<Users> = new MatTableDataSource<Users>([]);
  userDetails: any[] = [];
  displayedColumns: string[] = ['User Id', 'UserName', 'Name', 'Phone'];
  isError = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchVendersList();
  }

  async fetchVendersList(){
    try {
      this.isLoading = true;
      this.isError = false;
      let url = 'http://localhost:8080/ZKart/Venders';

      const data = await firstValueFrom(this.http.get<Users[]>(url));
      this.userDetails = <Users[]>data;
      this.dataSource.data = this.userDetails;
      this.isLoading = false;
    } catch (e: any) {
      alert(e.error());
      this.isError = true;
    }
  }
}
