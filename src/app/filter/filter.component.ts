// filter.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FilterDailogComponent } from '../filter-dailog/filter-dailog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    MatIconModule, MatBadgeModule, MatButtonModule, 
    MatSelectModule, MatFormFieldModule, MatSidenavModule
  ],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {

  @Input() moduleMetaList: any
  @Output() editedPassword = new EventEmitter();

  constructor(public dialog: MatDialog,private router : Router) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(FilterDailogComponent, {
      width: '550px',
      data: {moduleMetaList:JSON.parse(JSON.stringify(this.moduleMetaList)) }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'save') {

          let queryParams : any = {};
          result.data.forEach((d:any)=>{
            if(d.isChecked){
              queryParams[d.name] = d.value;
            }
          })
          const queryParamss : any = {
            search: JSON.stringify(queryParams) 
          };
      
          const navigationExtras = {
            queryParams:queryParamss
          };
        
          this.router.navigate(['/home/shopping'], navigationExtras );
        } else {
          console.log('The dialog was closed');
        }
      }
    });


  }
}
