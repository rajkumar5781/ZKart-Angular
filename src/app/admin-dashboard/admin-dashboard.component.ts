import { Component } from '@angular/core';
import { DoughnutChartComponent } from '../doughnut-chart/doughnut-chart.component';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { PolarAreaChartComponent } from '../polar-area-chart/polar-area-chart.component';
import { LineChartComponent } from '../line-chart/line-chart.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DoughnutChartComponent,BarChartComponent,PieChartComponent,PolarAreaChartComponent,LineChartComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  
}
