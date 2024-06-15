import { Component, Input, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { arrayOfRGB } from '../utils/common-utils'
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css'
})
export class LineChartComponent {

  @Input() label: any;
  @Input() canvasId: string = "line";

  data : any[] =[];
  labels : any[] = [];
  chart: Chart<'line'> | undefined;
  isLoading : boolean = true;
  chartData: any[] | undefined;

  constructor(private http:HttpClient) {
    Chart.register(...registerables);
  }

  async ngOnInit(){
    this.isLoading = true;
    await this.loadChartData();
    this.deserializeData();
    this.updateChart();
    this.isLoading = false;
  }

  ngAfterViewInit() {
  this.createChart();
}
ngOnDestroy(): void {
  // Destroy the chart instance when the component is destroyed
  if (this.chart) {
    this.chart.destroy();
    const chart = document.getElementById(this.canvasId) as HTMLCanvasElement;
    chart.remove();
  }
}

ngOnChanges(changes: SimpleChanges) {
  if (changes['chartData']) {
    this.deserializeData();
    this.updateChart();
  }
}

createChart() {
  const chart = document.getElementById(this.canvasId) as HTMLCanvasElement;
  console.log(chart,"JDBDJBJDBJD");
  if (this.chart) {
  this.chart.destroy()
  }
  this.chart = new Chart(chart, {
    type: 'line',
    data: {
      labels: this.labels,
      datasets: [{
        label: this.label,
        data: this.data,
        backgroundColor: arrayOfRGB()
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (label: string | number) =>{
              const value : any = typeof label === 'string' ? label : label.toString();
               return "$"+value;
            }
          }
        },
      },
      plugins: {
        title: {
            display: true,
            text: this.label,
        }
    },
      responsive:true,
      maintainAspectRatio:false,
    },
  });
}

updateChart() {
  if (this.chart) {
    this.chart.data.labels = this.labels;
    this.chart.data.datasets[0].data = this.data;
    this.chart.update();
  }
}

deserializeData() {
  this.data = [];
  this.labels = [];
  this.chartData?.forEach((d: any) => {
    this.data.push(d.totalAmountSum);
    this.labels.push(d.orderDate);
  });
}
async loadChartData(){
  let url = 'http://localhost:8080/ZKart/ProfitOfTheDayChart';

  this.chartData = await firstValueFrom(this.http.get<any[]>(url));
    // this.chartData = data;
}
}
