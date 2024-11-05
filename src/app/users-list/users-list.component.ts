import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { environment } from '../../../enviroment';

interface Users {
  name: string;
  lastName: string;
  phoneNumber: number;
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule, MatTableModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
})
export class UsersListComponent {
  isLoading = false;
  dataSource: MatTableDataSource<Users> = new MatTableDataSource<Users>([]);
  userDetails: any[] = [];
  displayedColumns: string[] = ['User Id', 'UserName', 'Name', 'Phone'];
  isError = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchUsersList();
  }

  async fetchUsersList() {
    try {
      this.isLoading = true;
      this.isError = false;
      let url = environment.server+'/ZKart/Users';

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
