import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FilterDailogComponent } from '../filter-dailog/filter-dailog.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { validator } from '../utils/inputValidationUtils';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create-dashboard-dailog',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './create-dashboard-dailog.component.html',
  styleUrl: './create-dashboard-dailog.component.css'
})
export class CreateDashboardDailogComponent {

  @Input() dashboardId! : number;

  isNew : boolean = false;
  folders : any[] = [];
  isLoading : boolean = false;

  dashboardForm = new FormGroup({
    folderId:new FormControl('',Validators.required),
    name: new FormControl('', [
      Validators.required,
      validator(/^[a-zA-Z\s]{2,20}$/),
    ]),
  });

  constructor(
    public dialogRef: MatDialogRef<CreateDashboardDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private router:Router
  ) {}

  ngOnInit(){
    this.loadFolders();
    if(typeof this.dashboardId == "undefined"){
      this.isNew = true;
    }
  }

  name: string | undefined;

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveDashBoardName() {
    if(this.dashboardForm.valid){
    this.dialogRef.close({ event: 'save', data: {name:this.dashboardForm.get("name")?.value,folderId:this.dashboardForm.get("folderId")?.value} });
    }
  }
  async loadFolders(){
    try {
      this.isLoading = true;
      let params = new HttpParams().set("type","dashboard");
      let url = 'http://localhost:8080/ZKart/Folders';
      this.folders = await firstValueFrom(this.http.get<any[]>(url, { params }));
      this.isLoading = false;
    } catch (e) {
      console.log(e);
      this.isLoading = false;
    }
  }
}
