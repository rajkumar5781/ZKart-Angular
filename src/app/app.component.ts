import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AppHelloWorldComponent } from './app-hello-world/app-hello-world.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { isAdmin, isVender } from './auth.guard';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SideNavComponent } from './side-nav/side-nav.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { VenterSideNavComponent } from './venter-side-nav/venter-side-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,AppHelloWorldComponent,MatSlideToggleModule,MatSidenavModule,SideNavComponent,MatIconModule,CommonModule,VenterSideNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isAdmin = false;
  isVender = false;
  title = 'ZKart';
  opened: boolean = false;
  vendrOpened : boolean = false;
  isAuthenticated$: Observable<boolean> | undefined;

  constructor(private router:Router){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAdmin = isAdmin();
        this.isVender = isVender();
      }
    });
  }

  ngOnInit(){
    this.isAdmin = isAdmin();
  }
}
