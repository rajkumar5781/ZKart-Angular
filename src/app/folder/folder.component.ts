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
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.css'
})
export class FolderComponent {
  @Input() id: any;
  @Input() name: string | undefined;
  @Output() editedFolderName = new EventEmitter();
  @Output() deleteFolder = new EventEmitter();

  constructor(public dialog: MatDialog,private http:HttpClient) {}

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
}
