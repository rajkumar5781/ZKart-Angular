import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { arrayOfRGB,truncateText } from '../utils/common-utils'
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-polar-area-chart',
  standalone: true,
  imports: [],
  templateUrl: './polar-area-chart.component.html',
  styleUrl: './polar-area-chart.component.css'
})
export class PolarAreaChartComponent {
  @Input() label: any;
  @Input() canvasId: string = "polar";

  data : any[] =[];
  labels : any[] = [];
  chart: Chart<'polarArea'> | undefined;
  isLoading : boolean = true;
  chartData: any[] | undefined;

  @ViewChild('customLegend', { static: false }) customLegend!: ElementRef<HTMLDivElement>;

  constructor(private http:HttpClient){
    Chart.register(...registerables);
  }

  async ngOnInit(){
    this.isLoading = true;
    await this.loadChartData();
    this.deserializeData();
    this.updateChart();
    this.isLoading = false;
  }

  ngAfterViewInit(){
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

  deserializeData() {
    this.data = [];
    this.labels = [];
    this.chartData?.forEach((d: any) => {
      this.data.push(d.Discounts);
      this.labels.push(d.Name);
    });
  }

  createChart(){
    
    const htmlLegendPlugin = {
      id: 'htmlLegend',
      afterUpdate: (chart: any) => {
        const ul = this.getOrCreateLegendList(chart);

        // Remove old legend items
        while (ul.firstChild) {
          ul.firstChild.remove();
        }

        // Reuse the built-in legendItems generator
        const items = chart.options.plugins.legend.labels.generateLabels(chart);

        items.forEach((item: { index: any; datasetIndex: any; fillStyle: string; strokeStyle: string; lineWidth: string; fontColor: string; hidden: any; text: string; }) => {
          const li = document.createElement('li');
          li.style.alignItems = 'center';
          li.style.cursor = 'pointer';
          li.style.display = 'flex';
          li.style.flexDirection = 'row';
          li.style.marginLeft = '10px';
          li.style.minWidth = '85px';

          li.onclick = () => {
            const { type } = chart.config;
            if (type === 'pie' || type === 'doughnut') {
              // Pie and doughnut charts only have a single dataset and visibility is per item
              chart.toggleDataVisibility(item.index);
            } else {
              chart.toggleDataVisibility(item.index);
              chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
            }
            chart.update();
          };

          // Color box
          const boxSpan = document.createElement('span');
          boxSpan.style.background = item.fillStyle;
          boxSpan.style.borderColor = item.strokeStyle;
          boxSpan.style.borderWidth = item.lineWidth + 'px';
          boxSpan.style.display = 'inline-block';
          boxSpan.style.flexShrink = '0';
          boxSpan.style.height = '20px';
          boxSpan.style.marginRight = '10px';
          boxSpan.style.width = '20px';

          // Text
          const textContainer = document.createElement('p');
          textContainer.style.color = item.fontColor;
          textContainer.style.margin = '0';
          textContainer.style.padding = '0';
          textContainer.style.whiteSpace = 'nowrap';
          textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

          const text = document.createTextNode(truncateText(item.text, 6));
          textContainer.appendChild(text);

          li.appendChild(boxSpan);
          li.appendChild(textContainer);
          ul.appendChild(li);
        });
      }
    };

  const ctx = document.getElementById(this.canvasId) as HTMLCanvasElement;
  if (this.chart) {
    this.chart.destroy()
    }
    this.chart = new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: this.labels,
      datasets: [{
        label: this.label,
        data: this.data,
        borderWidth: 1,
        backgroundColor:arrayOfRGB()
      }]
    },
    options: {
      responsive:true,
      maintainAspectRatio:false,
      plugins: {
        legend: {
          display: false,
        },
        title:{
          display:true,
          text:this.label,
        }
      },     
    },
    plugins: [htmlLegendPlugin]
  }as ChartConfiguration<'polarArea'>);
}

updateChart() {
  if (this.chart) {
    this.chart.data.labels = this.labels;
    this.chart.data.datasets[0].data = this.data;
    this.chart.update();
  }
}

getOrCreateLegendList(chart: any) {
  const legendContainer = this.customLegend.nativeElement;
  let listContainer = legendContainer.querySelector('ul');

  if (!listContainer) {
    listContainer = document.createElement('ul');
    listContainer.style.display = 'flex';
    listContainer.style.flexDirection = 'row';
    listContainer.style.margin = '0';
    listContainer.style.padding = '0';

    legendContainer.appendChild(listContainer);
  }

  return listContainer;
}
async loadChartData(){
  let url = 'http://localhost:8080/ZKart/TopDiscountProducts';

  this.chartData = await firstValueFrom(this.http.get<any[]>(url));
    // this.chartData = data;
}
}
