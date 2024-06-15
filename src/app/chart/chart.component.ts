// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-chart',
//   standalone: true,
//   imports: [],
//   templateUrl: './chart.component.html',
//   styleUrl: './chart.component.css'
// })
// export class ChartComponent {

// }


import { Component, Input, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { arrayOfRGB, truncateText } from '../utils/common-utils';
import 'chartjs-plugin-datalabels';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
   templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent {
  @Input() label: any;
  @Input() canvasId!: string;
  // @Input() chartData: any[] | undefined;
  elementRef: any;
  constructor(private http:HttpClient) {
    Chart.register(...registerables);
  }

  data: any[] = [];
  labels: any[] = [];
  chart: Chart | undefined;
  isLoading: boolean = true;
  chartData: any[] | undefined
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

  ngOnDestroy(){
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

  private deserializeData() {
    this.data = [];
    this.labels = [];
    this.chartData?.forEach((d: any) => {
      this.data.push(d.data);
      this.labels.push(d.Name);
    });
  }

  private createChart() {
    const ctx = document.getElementById(this.canvasId) as HTMLCanvasElement;
    if (this.chart) {
      this.chart.destroy()
      }
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: this.label,
            data: this.data,
            borderWidth: 1,
            backgroundColor: arrayOfRGB(),
          },
        ],
      },
      options: {
        // aspectRatio: 2,
        responsive:true,
        maintainAspectRatio:false,
        scales: {
          y: {
            beginAtZero: true,
          },
          x: {
            ticks: {
              callback: (
                label: string | number,
                index: number,
                ticks: any[]
              ) => {
                const value: any =
                  typeof label === 'string' ? label : label.toString();
                return truncateText(this.labels[value], 6); // Truncate the label to 10 characters
              },
            },
          },
        },
        onResize: this.handleResize,
        plugins: {
          title: {
              display: true,
              text: this.label,
          },
        //   tooltips: {
        //     mode: 'index',
        //     intersect: false,
        // },
      }
      },
    }as ChartConfiguration<'bar'>);
  }

  private  updateChart() {
    if (this.chart) {
      this.chart.data.labels = this.labels;
      this.chart.data.datasets[0].data = this.data;
      this.chart.update();
    }
  }
  private  handleResize = (chart: { resize: () => void; }) => {
    console.log("dbdb");
    }
    private  async loadChartData(){
      let url = 'http://localhost:8080/ZKart/Charts';

      this.chartData = await firstValueFrom(this.http.get<any[]>(url));
    }
}
