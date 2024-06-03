import { Component } from '@angular/core';
import { Chart,registerables } from 'chart.js';
import { arrayOfRGB } from '../utils/common-utils'

@Component({
  selector: 'app-doughnut-chart',
  standalone: true,
  imports: [],
  templateUrl: './doughnut-chart.component.html',
  styleUrl: './doughnut-chart.component.css'
})
export class DoughnutChartComponent {

  constructor(){
    Chart.register(...registerables);
  }

  ngAfterViewInit(){
    const chart = document.getElementById("doughnut-chart") as HTMLCanvasElement;

    new Chart(chart, {
      type: 'doughnut',
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
        aspectRatio: 2,
      }
    });
  }

}
