import { Component, ElementRef, HostListener, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { DoughnutChartComponent } from '../doughnut-chart/doughnut-chart.component';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { PolarAreaChartComponent } from '../polar-area-chart/polar-area-chart.component';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { firstValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray, CdkDragEnter, CdkDragEnd} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CreateDashboardDailogComponent } from '../create-dashboard-dailog/create-dashboard-dailog.component';
import { CreateFolderDailogComponent } from '../create-folder-dailog/create-folder-dailog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FolderComponent } from '../folder/folder.component';
import { DashboardFolderComponent } from '../dashboard-folder/dashboard-folder.component';
import { Router } from '@angular/router';
import { environment } from '../../../enviroment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DoughnutChartComponent,BarChartComponent,PieChartComponent,PolarAreaChartComponent,LineChartComponent,CommonModule,CdkDropList,CdkDrag,ResizableModule,MatIconModule,FolderComponent,DashboardFolderComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  @ViewChild('resizableContainer') resizableContainer!: ElementRef;
  @ViewChildren(CdkDropList)
  dropsQuery!: QueryList<CdkDropList>;
  constructor(private http : HttpClient,private renderer : Renderer2,public dialog: MatDialog,private _snackBar: MatSnackBar,private router:Router){}
  lineChart : any = [];
  doughnutChart : any = [];
  productDetailsPieChart : any = [];
  topDiscountProducts : any = [];
  profitOfTheDays : any = [];
  dashBoardCharts : any = [];
  isResizing = false;
  startIndex = null;
  endIndex = null;
  isLoading = false;
  folders: any[] = [];

  timePeriods = [
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century',
  ];
  drops: CdkDropList[] = [];

  async drop(event: CdkDragDrop<any>) {
    console.log(this.startIndex,this.endIndex);
    // if(event.previousIndex != event.currentIndex){
    //   this.changeChartsPosition(event.previousIndex,event.currentIndex);
    // }
    if(this.startIndex!=null && this.endIndex!=null){
    // moveItemInArray(this.dashBoardCharts, this.startIndex, this.endIndex);
    await this.updateProduct();
    this.fetchDashBoardCharts();
    }
  }

  // entered($event: any) {
  //   console.log($event);
    
  //   console.log($event.item.data, $event.container.data);
  //   moveItemInArray(this.dashBoardCharts, $event.item.data, $event.container.data);
  // }

  onResize(chartId: number) {
    const containerHeight = this.resizableContainer.nativeElement.clientHeight;
    console.log(`Container ${chartId} resized. New height: ${containerHeight}`);
    // Update the height of the corresponding chart
    const chartIndex = this.dashBoardCharts.findIndex((chart: { id: number; }) => chart.id === chartId);
    if (chartIndex !== -1) {
        this.dashBoardCharts[chartIndex].height = containerHeight;
    }
}
trackByFolderId(index: number, folder: any): number {
  return folder.id;
}

// async changeChartsPosition(first:number,second:number){



//   let url = environment+'/ZKart/CutomerDetail';
//     let params = new HttpParams().set('name', this.customerDetailForm.get('name')?.value || '')
//     .set('lastName', this.customerDetailForm.get('lastName')?.value || '')
//     .set('phone', this.customerDetailForm.get('phone')?.value || NaN);
    
//   await firstValueFrom(
//     this.http.post(url, params, {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/x-www-form-urlencoded',
//       }),
//       responseType: 'text',
//     })
//   );
// }
  
  
  ngOnInit(){
    // this.fetchDashBoardCharts();
    this.fetchFolders();
    // this.fetchTopSellingChart();
    // this.fetchTotalSellingChart();
    // this.fetchProductQuentity();
    // this.fetchTopDiscountProduct();
    // this.fetchProfitOfTheDays();
  }

  async fetchDashBoardCharts(){
    let url = environment.server+'/ZKart/DashBoardCharts';

    const data = await firstValueFrom(this.http.get<any[]>(url));
    this.dashBoardCharts = data;
    this.dropsQuery.changes.subscribe(() => {
      this.drops = this.dropsQuery.toArray()
    })
    Promise.resolve().then(() => {
      this.drops = this.dropsQuery.toArray();
      console.log(this.drops);
    })
  }

  async fetchTopSellingChart(){
    let url = environment.server+'/ZKart/Charts';

    const data = await firstValueFrom(this.http.get<any[]>(url));
    this.lineChart = data;
  }
  async fetchTotalSellingChart(){
    let url = environment.server+'/ZKart/TotalSelleingChart';

    const data = await firstValueFrom(this.http.get<any[]>(url));
    this.doughnutChart = data;
  }
  
  async fetchProductQuentity(){
    let url = environment.server+'/ZKart/ProductAvailabilityChart';

    const data = await firstValueFrom(this.http.get<any[]>(url));
    this.productDetailsPieChart = data;
  }
  async fetchTopDiscountProduct(){
    let url = environment.server+'/ZKart/TopDiscountProducts';

    const data = await firstValueFrom(this.http.get<any[]>(url));
    this.topDiscountProducts = data;
  }

  async fetchProfitOfTheDays(){
    let url = environment.server+'/ZKart/ProfitOfTheDayChart';

    const data = await firstValueFrom(this.http.get<any[]>(url));
    this.profitOfTheDays = data;
  }

  // @HostListener('window:resize', ['$event.target'])
  // onResize(chart:any,target: any) {
  //   console.log("knjdnkd");
  //   console.log(target.clientHeight);
  //   chart.height = target.clientHeight;
  // }

  // onResizeEnd(event: ResizeEvent): void {
  //   console.log('Element was resized', event);
  // }
  // onResizeEnd(event: ResizeEvent, className:string) {
  //   if (event) {
  //     console.log(event);
  //     // if (event.rectangle.width != null) {
  //     //   $("."+className).width(event.rectangle.width);
  //     // }
  //   }
  // }

  onResizeStart(): void {
    this.isResizing = true;
  }

  // Called when resizing ends
  onResizeEnd(event: any): void {
    console.log('Element was resized', event);
    this.isResizing = false;
  }

  onResized(event: Event) {
    console.log('The new size of the element is: ', event);
  }
  // onResizeEnd(event: ResizeEvent): void {
  //   console.log('Element was resized', event);
  // }

  entered($event: CdkDragEnter) {
    console.log($event.item.data, $event.container.data);
    this.startIndex = $event.item.data;
    this.endIndex = $event.container.data;
    // moveItemInArray(this.dashBoardCharts, $event.item.data, $event.container.data);
  }
  dragEnd($event: CdkDragEnd) {
    console.log($event);
}
async updateProduct() {
  const url = environment.server+"/ZKart/DashBoardCharts";
  if(this.startIndex==null || this.endIndex==null){
    return;
  }
  try{
  let param = new HttpParams().set('firstChart', JSON.stringify({order:(this.endIndex+1),id:this.dashBoardCharts[this.startIndex].id}));
  param = param.set("first","snn");
  param = param.set('secondChart', JSON.stringify({order:(this.startIndex+1),id:this.dashBoardCharts[this.endIndex].id}));
  await firstValueFrom(this.http.put(url, param));
  }
  catch(e){
    console.log(e);
  }
}

createDashBoard(): void {
  const dialogRef = this.dialog.open(CreateDashboardDailogComponent, {
    width: '550px',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if (result.event === 'save') {
        // this.editFolderName(result?.data?.value);
        console.log(result.data);
        this.createDashBoardApi(result.data);
      }
    }
  });
}

async createDashBoardApi(data : any){
  let url = environment.server+'/ZKart/Dashboard';
  let params = new HttpParams().set("dashboardName",data?.name || "").set("folderId",data.folderId);
  let datas = await firstValueFrom(
    this.http.post(url,params,{
      responseType: 'text',
    }));
    this.openSnackBar('Dashboard Created Successfully.');
    this.createDashboard(datas);
}

createFolder():void{
  const dialogRef = this.dialog.open(CreateFolderDailogComponent, {
    width: '550px',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if (result.event === 'save') {
        console.log(result);
        this.createFolderApi(result.data.value);
        // this.editFolderName(result?.data?.value);
      }
    }
  });
}

async createFolderApi(name:string){
  let params = new HttpParams()
    .set('folderName', name || '').set("folderType","dashboard");
  let url = environment.server+'/ZKart/Folders';

  await firstValueFrom(
    this.http.post(url, params, {
      responseType: 'text',
    })
  );
  this.openSnackBar('Created Successfully.');
  this.fetchFolders();
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

async fetchFolders() {
  try {
    this.isLoading = true;
    let params = new HttpParams().set("type","dashboard");
    let url = environment.server+'/ZKart/Folders';
    this.folders = await firstValueFrom(this.http.get<any[]>(url, { params }));
    this.isLoading = false;
  } catch (e) {
    console.log(e);
    this.isLoading = false;
  }
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

createDashboard(val:any){
  this.router.navigate(['/home/dashboard/create',val]);
}

deleteDashboards(val:any){
  this.fetchFolders();
}
}
