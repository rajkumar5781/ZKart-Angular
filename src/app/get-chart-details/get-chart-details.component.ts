import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { environment } from '../../../enviroment';

@Component({
  selector: 'app-get-chart-details',
  standalone: true,
  imports: [MatDialogModule,MatIconModule,MatButtonModule,FormsModule,MatSelectModule,MatFormFieldModule,MatInputModule,CommonModule],
  templateUrl: './get-chart-details.component.html',
  styleUrl: './get-chart-details.component.css'
})
export class GetChartDetailsComponent {

  reportsDetails : any = {};
  isLoading : boolean = false;
  reportId:number = NaN;
  name : string = "";

  constructor(
    public dialogRef: MatDialogRef<GetChartDetailsComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: FilterDialogData,
    private http : HttpClient
  ) {}

   async ngOnInit(){
    this.isLoading = true;
    await this.fetchReports();
    this.isLoading = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async fetchReports(){
    let url = environment.server+'/ZKart/Reports';
    this.reportsDetails = await firstValueFrom(this.http.get<any[]>(url));
  }

  saveChart(){
    this.dialogRef.close({ event: 'save', data: {id:this.reportId,name:this.name} });
  }
}
