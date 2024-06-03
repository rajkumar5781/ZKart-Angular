import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { arrayOfRGB } from '../utils/common-utils'

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css'
})
export class PieChartComponent {
  constructor(){
    Chart.register(...registerables);
  }

  ngAfterViewInit(){
    const chart = document.getElementById("pie-chart") as HTMLCanvasElement;

    new Chart(chart, {
      type: 'pie',
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
        aspectRatio: 1,
      }
    });
  }
}
