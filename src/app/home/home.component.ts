import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatBadgeModule, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router, private route: ActivatedRoute,private location: Location) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.getLastSegment();
      }
    });
   }  

  ngOnInit(): void {
    this.getLastSegment();
  }
  navigateToSignIn() {
    this.router.navigate(['/signin']);
  }
  activeIndex: number | null = 0;

  setActive(index: number): void {
    this.activeIndex = index;
    if (index == 0) {
      this.router.navigate(['home/sitehome']);
    }
    else if (index == 1) {
      this.router.navigate(['home/shopping']);
    }
    else if (index == 2) {
      this.router.navigate(['home/account']);
    }
    else if (index == 3) {
      this.router.navigate(['home/contact']);
    }
  }

  getLastSegment(): void {
    const path = this.location.path();
    const segments = path.split('/');
    const lastSegment = segments[2];
    let val = 0;
    switch (lastSegment) {
      case 'shopping': {
        val = 1;
        break;
      }
      case 'account': {
        val = 2;
        break;
      }
      case 'contact': {
        val = 3;
        break;
      }
    }
    this.activeIndex = val;
  }
}
