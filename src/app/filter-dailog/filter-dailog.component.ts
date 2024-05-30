import { Component, Inject,Input, QueryList, ViewChildren } from '@angular/core';
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

  @ViewChildren(FieldConditionComponent) components: QueryList<FieldConditionComponent> | undefined;

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

    // let isValid = this.data.moduleMetaList.findIndex((d: { value: null; isChecked: any; })=>{
    //   if(d.isChecked && d.value==null ){
    //     return false;
    //   }
    // })
    // if(isValid!=null){

    // }

    let isValid = true;
    this.components?.forEach(component => {
      console.log(component)
      if(component.fieldDetails.isChecked && (component.fieldDetails.value==null || component.fieldDetails.value=="" || this.valueCheckValidation(component.fieldDetails))){
        isValid = false;
      }
    });
    if(!isValid){
      alert("please fill the all details");
      return;
    }
    this.dialogRef.close({ event: 'save', data: this.data.moduleMetaList });
  }
  valueCheckValidation(fieldDetails: { ui_type: string; value: number[]; } ){
    if(fieldDetails?.ui_type=="range" && (fieldDetails?.value[0]<1 || fieldDetails?.value[1]<1 || fieldDetails?.value[0]==undefined || fieldDetails?.value[1]==undefined)){
      return true;
    }
    return false;
  }
}
