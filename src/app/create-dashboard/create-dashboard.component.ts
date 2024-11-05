import { Component, ElementRef, ViewChild, AfterViewInit, ViewContainerRef, ComponentRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { GetChartDetailsComponent } from '../get-chart-details/get-chart-details.component';
import { MatDialog } from '@angular/material/dialog';
import { GridStack, GridStackWidget } from 'gridstack';
import { ChartComponent } from '../chart/chart.component';
import { GridstackComponent } from 'gridstack/dist/angular';
import { CommonModule, Location } from '@angular/common';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { PolarAreaChartComponent } from '../polar-area-chart/polar-area-chart.component';
import { DoughnutChartComponent } from '../doughnut-chart/doughnut-chart.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../enviroment';

@Component({
  selector: 'app-create-dashboard',
  standalone: true,
  imports: [MatButtonModule, MatIconModule,CommonModule],

  templateUrl: './create-dashboard.component.html',
  styleUrls: ['./create-dashboard.component.css']
})
export class CreateDashboardComponent implements AfterViewInit {

  createChartDetails : any[] = [];
  @ViewChild('gridstackContainer', { static: false }) gridstackContainer!: ElementRef;
  @ViewChild('widgetContainer', { read: ViewContainerRef }) widgetContainer!: ViewContainerRef;
  @ViewChild(ChartComponent, { static: false }) chartComponent!: ChartComponent;
  id: number = -1;
  routeAction:string = "";

  constructor(public dialog: MatDialog,private router:Router,private http:HttpClient,private route: ActivatedRoute,private location:Location,private _snackBar: MatSnackBar){
    GridstackComponent.addComponentToSelectorType([ChartComponent]);
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.id = idParam !== null ? +idParam : 0; 
    });
  }



  openDialog(): void {
    const dialogRef = this.dialog.open(GetChartDetailsComponent, {
      width: '550px',
      // data: {moduleMetaList:JSON.parse(JSON.stringify(this.moduleMetaList)) }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'save') {
          console.log(result);
          this.createChartDetails.push({reportId:result.data.id,chartName:result.data.name});
          console.log(this.createChartDetails);
          this.add(this.createChartDetails[this.createChartDetails.length-1],this.createChartDetails.length,"");
        }
      }
    });
  }

  dragEl =
  '<span class="drag" style="background-color: gray; display:flex;width:100%;height:90%; color:white; cursor: grab; padding: 0.25rem">Drag</span>';

  public items: GridStackWidget[] = [
    { x: 0, y: 0, w: 9, h: 6, content: this.dragEl, },
    { x: 9, y: 0, w: 3, h: 3, content: this.dragEl },
    { x: 9, y: 3, w: 3, h: 3, content: this.dragEl },
  ];
  private grid!: GridStack;

  // gridOptionsFull: NgGridStackOptions = {
  //   ...this.items,
  //   children: [ 
  //     { x: 0, y: 1, w: 8, h: 1, minW: 2, selector: 'app-chart', id: '1', autoPosition: true },
  //   ]
  // }

  

  public async ngOnInit() {
    await this.getDashboardDetails();
    const path = this.location.path();
    this.routeAction = path.split('/')[3];
    this.loadCharts();
    // this.grid = GridStack.init({
    //   cellHeight: 70,
    // })
    // .load(this.items); 
    // and load our content directly (will create DOM)
  }

  ngAfterViewInit() {
    if (this.gridstackContainer && this.gridstackContainer.nativeElement) {
      this.grid = GridStack.init({
        cellHeight: 70,
        margin: 5,
      }, this.gridstackContainer.nativeElement);

      // Load initial items
      // this.grid?.load(this.items);
      // this.grid.addWidget(ChartComponent,{})
      // this.addChartToWidget(this.grid.engine.nodes[0].el!);
      this.grid.on('dropped',this.onDragStop.bind(this));
      this.grid.on('dragstart',this.onDragStop.bind(this))
    } else {
      console.error('gridstackContainer is not defined');
    }
  }

  private loadCharts(){
    this.createChartDetails.forEach((d,index)=>{
      this.add(d,index,"load");
    })
  }

  private add(data:any,index:number,status:string) {
    // let data = cloneDeep(this.createChartDetails);
    const componentRef = this.chooseChart(data.reportId);
    componentRef.instance.label = data.chartName;

    componentRef.instance.canvasId = `dbarChart_${index}`;
    const chartElement = componentRef.location.nativeElement;
    let newWidget: HTMLElement =  document.createElement('div');
    if(status == "load"){
      newWidget = this.grid.addWidget({ w: data.width, h: data.height,x:data.x,y:data.y, content: '' });
    }
    else if(status == ""){
      newWidget = this.grid.addWidget({ w: 3, h: 3, content: '' });
    }
    let contentElement : HTMLElement  = newWidget.querySelector('.grid-stack-item-content') as HTMLElement;
    if (contentElement) {
      contentElement.classList.add("border-8");
      contentElement.style.boxShadow = '0 1px 4px rgba(0,0,0,.16)';
      contentElement.appendChild(chartElement);
    } else {
      console.error('grid-stack-item-content not found');
    }
  }
  public delete() {
    this.grid.removeWidget(this.grid.engine.nodes[0].el!);
  }
  public change() {
   this.grid.update(this.grid.engine.nodes[0].el!, {w: 1});
  }

  onGridstackChanged(event: any) {
    console.log('Gridstack changed:', event);
  }
  identify(index: number, w: GridStackWidget) {
    return w.id;
  }

  chooseChart(reportId: number): ComponentRef<any> {
    switch (reportId) {
      case 10000:
        return this.widgetContainer.createComponent(PieChartComponent);
      case 10001:
        return this.widgetContainer.createComponent(BarChartComponent);
      case 10002:
        return this.widgetContainer.createComponent(PolarAreaChartComponent);
      case 10003:
        return this.widgetContainer.createComponent(DoughnutChartComponent);
      case 10004:
        return this.widgetContainer.createComponent(LineChartComponent);
      default:
        throw new Error(`Unsupported reportId: ${reportId}`);
    }
  }

  async saveDashBoard(){

    if(this.routeAction == "edit"){
      await this.editDashboard();
      await this.openSnackBar('Dashboard Updated Successfully.');
      this.location.back();
    }
    else{
      await this.createDashboard();
      await this.openSnackBar('Dashboard Created Successfully.');
      this.location.back();
    }
  }

  async createDashboard(){
    try{
      // this.isUpdating = true;
      let url = environment.server+"/ZKart/DashBoardCharts";

      let params = new HttpParams();

      let data = [];
     data= this.createChartDetails.map((d,index)=>{
      let node : any = this.grid.engine.nodes[index];
        return {
          chartName:d.chartName,
          type:"",
          reportId:d.reportId,
          width:node?.w,
          height:node?.h,
          x:node.x,
          y:node.y,
          dashboardId:this.id,
        }
      })

      params = params.set("charts",JSON.stringify(data));
      // if(actionType=="update"){
      //   product.productCount = newValue;
      //   params = params.set("count",newValue);
      // }
      await firstValueFrom(
        this.http.post(url, params)
      );
      // this.isUpdating = false;
      // if(actionType=="delete"){
      //   this.getAddToCartDetail();
      // }
    }
    catch(e){
      console.log(e);
    }
  }

  async editDashboard(){
    try{
    let url = environment.server+"/ZKart/DashBoardCharts";

    let params = new HttpParams();

    let data = [];
   data= this.createChartDetails.map((d,index)=>{
    let node : any = this.grid.engine.nodes[index];
    let id = -1;
    if(d?.id){
      id = d.id;
    }
      return {
        chartName:d.chartName,
        type:"",
        reportId:d.reportId,
        width:node?.w,
        height:node?.h,
        x:node.x,
        y:node.y,
        dashboardId:this.id,
        id,
      }
    })

    params = params.set("charts",JSON.stringify(data));

    await firstValueFrom(
      this.http.put(url, params, {
        responseType: 'text',
      })
    );
  }
  catch(e){
    console.log(e);
  }

  }

  onDragStop(event: any, el: any) {
    console.log(this.createChartDetails);
    console.log('Drag stopped:', event, el);
  }

  async getDashboardDetails(){
    this.createChartDetails = [];
    let url = environment.server+'/ZKart/DashBoardCharts';
    let params = new HttpParams().set('id', this.id);

    this.createChartDetails = await firstValueFrom(this.http.get<any>(url, { params }));
  }

  async openSnackBar(message: string): Promise<void> {
    return new Promise<void>((resolve) => {
      const snackBarRef = this._snackBar.open(message, '', {
      duration: 2000,
    });
    snackBarRef.afterDismissed().subscribe(() => {
      resolve();
    });
  })

  }
}
