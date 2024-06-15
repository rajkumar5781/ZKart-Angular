import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FilterDailogComponent } from '../filter-dailog/filter-dailog.component';
import { HttpClient } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { validator } from '../utils/inputValidationUtils';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-folder-name',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-folder-name.component.html',
  styleUrl: './edit-folder-name.component.css',
})
export class EditFolderNameComponent {
  folderForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      validator(/^[a-zA-Z\s]{2,20}$/),
    ]),
  });

  constructor(
    public dialogRef: MatDialogRef<FilterDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {}

  name: string | undefined;

  ngOnInit() {
    this.folderForm.get('name')?.setValue(this.data.name);
    this.name = this.data.name;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveFolderName() {
    if(this.folderForm.valid){
    this.dialogRef.close({ event: 'save', data: this.folderForm.get("name") });
    }
  }
}
