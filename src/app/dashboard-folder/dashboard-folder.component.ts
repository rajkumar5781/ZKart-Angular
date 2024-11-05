import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EditFolderNameComponent } from '../edit-folder-name/edit-folder-name.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../enviroment';

@Component({
  selector: 'app-dashboard-folder',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatMenuModule,
  MatButtonModule,
    CommonModule,
  ],
  templateUrl: './dashboard-folder.component.html',
  styleUrl: './dashboard-folder.component.css'
})
export class DashboardFolderComponent {

  @Input() id: any;
  @Input() name: string | undefined;
  @Output() editedFolderName = new EventEmitter();
  @Output() deleteFolder = new EventEmitter();

  isLoading:boolean = false;
  dashboards : any[] = [];

  constructor(public dialog: MatDialog,private http:HttpClient,private router:Router) {}

  editFolderName(val:string){
    this.editedFolderName.emit({id:this.id,name:val});
  }

  deleteFolders(){
    this.deleteFolder.emit({id:this.id});
  }

  openEditFolderDialog(): void {
    const dialogRef = this.dialog.open(EditFolderNameComponent, {
      width: '550px',
      data: {name:this.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'save') {
          this.editFolderName(result?.data?.value);
        }
      }
    });
  }
  open(){
    this.fetchDashBoards();
  }
  async fetchDashBoards(){
    try {
      this.isLoading = true;
      let url = environment.server+'/ZKart/Dashboard';
      let params = new HttpParams().set("folderId",this.id);
      this.dashboards = await firstValueFrom(this.http.get<any[]>(url,{params}));
      this.isLoading = false;
    } catch (e) {
      console.log(e);
      this.isLoading = false;
    }
  }
  goToDashboardsView(val:any){
    this.router.navigate(['/home/dashboard/dashboard',val.id,this.id])
  }
  createDashboard(val:any){
    this.router.navigate(['/home/dashboard/create',val]);
  }

  editDashboard(val:any){
    this.router.navigate(['/home/dashboard/edit',val]);
  }
}
