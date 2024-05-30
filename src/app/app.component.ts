import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHelloWorldComponent } from './app-hello-world/app-hello-world.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { isAdmin } from './auth.guard';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SideNavComponent } from './side-nav/side-nav.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,AppHelloWorldComponent,MatSlideToggleModule,MatSidenavModule,SideNavComponent,MatIconModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isAdmin = false;
  title = 'ZKart';
  opened: boolean = false;

  ngOnInit(){
    this.isAdmin = isAdmin();
  }
}
