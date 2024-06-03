import { Component, Input } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { arrayOfRGB } from '../utils/common-utils'

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent {
@Input() label : any;

  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    const ctx = document.getElementById('dbarChart') as HTMLCanvasElement;
    new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: this.label,
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
