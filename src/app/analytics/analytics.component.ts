import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FolderComponent } from '../folder/folder.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../enviroment';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [MatIconModule, CommonModule, FolderComponent],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
})
export class AnalyticsComponent {
  folders: any[] = [];
  isLoading = false;

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.fetchFolders();
  }

  trackByFolderId(index: number, folder: any): number {
    return folder.id;
  }

  async fetchFolders() {
    try {
      this.isLoading = true;
      let url = environment.server+'/ZKart/Folders';
      let params = new HttpParams().set("type","analytics");
      this.folders = await firstValueFrom(this.http.get<any[]>(url,{params}));
      this.isLoading = false;
    } catch (e) {
      console.log(e);
      this.isLoading = false;
    }
  }

  async editFolderName(folderDetails: any) {
    let params = new HttpParams()
      .set('folderName', folderDetails.name || '')
      .set('id', folderDetails.id);
    let url = environment.server+'/ZKart/Folders';

    await firstValueFrom(
      this.http.put(url, params, {
        responseType: 'text',
      })
    );
    this.openSnackBar('Renamed Successfully.');
    this.fetchFolders();
  }

  async deleteFolder(folderDetails: any) {
    let params = new HttpParams().set('id', folderDetails.id);
    let url = environment.server+'/ZKart/Folders';
    try {
      await firstValueFrom(
        this.http.delete(url, {
          params: params,
        })
      );
      this.openSnackBar('Folder Deleted Successfully.');
      this.fetchFolders();
    } catch (e) {
      console.log(e);
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 2000,
    });
  }
}
