import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ComponentRef, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { GridStack } from 'gridstack';
import { firstValueFrom } from 'rxjs';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { PolarAreaChartComponent } from '../polar-area-chart/polar-area-chart.component';
import { DoughnutChartComponent } from '../doughnut-chart/doughnut-chart.component';
import { ActivatedRoute } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-dashboard-view-page',
  standalone: true,
  imports: [NgxSkeletonLoaderModule],
  templateUrl: './dashboard-view-page.component.html',
  styleUrl: './dashboard-view-page.component.css'
})
export class DashboardViewPageComponent {

  @ViewChild('gridstackContainer', { static: false }) gridstackContainer!: ElementRef;
  @ViewChild('widgetContainer', { read: ViewContainerRef }) widgetContainer!: ViewContainerRef;

  createChartDetails : any[] = [];
  id: number = -1;
  folderId : number = -1;
  folderDetails : any;
  isLoading : boolean = false;
  private grid!: GridStack;

  constructor(private http:HttpClient,private route: ActivatedRoute){
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const folderId = params.get('folderId');
      this.id = idParam !== null ? +idParam : 0; 
      this.folderId = folderId !== null ? +folderId : 0;
    });
  }

  public async ngOnInit() {
    this.fetchFolderDetails();
    await this.getDashboardDetails();
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
        disableDrag:true,
        disableResize:true,
      }, this.gridstackContainer.nativeElement);

      // Load initial items
      // this.grid?.load(this.items);
      // this.grid.addWidget(ChartComponent,{})
      // this.addChartToWidget(this.grid.engine.nodes[0].el!);
      // this.grid.on('dropped',this.onDragStop.bind(this));
      // this.grid.on('dragstart',this.onDragStop.bind(this))
    } else {
      console.error('gridstackContainer is not defined');
    }
  }

  async getDashboardDetails(){
    this.createChartDetails = [];
    let url = 'http://localhost:8080/ZKart/DashBoardCharts';
    let params = new HttpParams().set('id', this.id);

    this.createChartDetails = await firstValueFrom(this.http.get<any>(url, { params }));
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

  async fetchFolderDetails(){
    try {
      this.isLoading = true;
      let params = new HttpParams().set("type","dashboard");
      params  = params.set("id",this.folderId);
      let url = 'http://localhost:8080/ZKart/Folders';
      let data = await firstValueFrom(this.http.get<any[]>(url, { params }));
      this.folderDetails = data[0];
      this.isLoading = false;
    } catch (e) {
      console.log(e);
      this.isLoading = false;
    }
  }

}
