import { Component, Inject,Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FilterDialogData } from '../filter-dialog-data';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FieldConditionComponent } from '../field-condition/field-condition.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-dailog',
  standalone: true,
  imports: [MatFormFieldModule, MatDialogModule, CommonModule,FieldConditionComponent,MatCheckboxModule,FormsModule],
  templateUrl: './filter-dailog.component.html',
  styleUrls: ['./filter-dailog.component.css']
})
export class FilterDailogComponent {
  constructor(
    public dialogRef: MatDialogRef<FilterDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FilterDialogData,
    private http : HttpClient
  ) {}
  moduleName = 'Products';
  moduleMetaList: any[] = [];
  isChecked=false;
  ngOnInit(){
    // this.getModuleMeta();
  }

  getModuleMeta() {
    let params = new HttpParams().set('module', this.moduleName);
    this.http
      .get('http://localhost:8080/ZKart/fieldDetails', { params })
      .subscribe((data: any) => {
        this.moduleMetaList = data;
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSave(): void {
    this.dialogRef.close({ event: 'save', data: this.data.moduleMetaList });
  }
}
