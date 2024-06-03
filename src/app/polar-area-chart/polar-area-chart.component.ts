import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { arrayOfRGB } from '../utils/common-utils'

@Component({
  selector: 'app-polar-area-chart',
  standalone: true,
  imports: [],
  templateUrl: './polar-area-chart.component.html',
  styleUrl: './polar-area-chart.component.css'
})
export class PolarAreaChartComponent {

  data = {
    labels: [
      'Red',
      'Green',
      'Yellow',
      'Grey',
      'Blue'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [11, 16, 7, 3, 14],
      backgroundColor: arrayOfRGB(),
    }]
  };

  constructor(){
    Chart.register(...registerables);
  }

  ngAfterViewInit(){
    const chart = document.getElementById("polarArea-chart") as HTMLCanvasElement;

    new Chart(chart, {
      type: 'polarArea',
      data:this.data,
      options:{
        aspectRatio: 1,
      }
    });
  }

}
