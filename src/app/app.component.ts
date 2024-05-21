import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHelloWorldComponent } from './app-hello-world/app-hello-world.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,AppHelloWorldComponent,MatSlideToggleModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ZKart';
}
