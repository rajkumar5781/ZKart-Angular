import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { arrayOfRGB } from '../utils/common-utils'

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css'
})
export class LineChartComponent {
  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    const ctx = document.getElementById('linechart') as HTMLCanvasElement;
    new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1,
        backgroundColor:arrayOfRGB()
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      aspectRatio:2,
    }
  });
}
}
