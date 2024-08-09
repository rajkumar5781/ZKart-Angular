import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { isAdmin, isVender } from '../auth.guard';
import { environment } from '../../../enviroment';

interface AddToCartCountResponse {
  count: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatBadgeModule, RouterOutlet,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isLoggedIn = signal(false);
   userId : any;
   addToCartTotal : any;
   isAdmin = false;
   isVender = false;

  constructor(private router: Router, private route: ActivatedRoute,private location: Location,private http:HttpClient) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.getLastSegment();
      }
    });
    this.isAdmin = isAdmin();
    this.isVender = isVender();
   }  

  ngOnInit(): void {
    this.getLastSegment();
    this.isLoggedIn.set(this.checkAuthentication());
    this.getAddToCartCount();
  }

  private checkAuthentication(): boolean {
    return typeof sessionStorage !== 'undefined' && sessionStorage.getItem('isAuthenticated') !== null;
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

  signOut() {
    this.http.post(environment.server+"/ZKart/ClearSession",{}).subscribe({
      next: (d) => {
        if (typeof sessionStorage !== 'undefined') {
          // localStorage.clear();
          sessionStorage.clear();
        }
        this.isLoggedIn.set(this.checkAuthentication());
        // this.reloadComponent();
      },
      error: (err) => {
        console.error('Error clearing session:', err);
      },
    })
    }
    goToAddToCart(){
      this.router.navigate(['/home/account/addtocart']);
    }

    getAddToCartCount(){
      if(this.checkAuthentication()){
      this.http.get<AddToCartCountResponse>(environment.server+"/ZKart/LoadAddToCartCount").subscribe((data)=>{
        this.addToCartTotal = data.count;
      })
      }
    }

    createDashboard(){
      this.router.navigate(['/home/dashboard/create']);
    }

    // reloadComponent() {
    //   this.router.navigateByUrl('/current-route', { skipLocationChange: true }).then(() => {
    //     this.router.navigate(['/current-route']);
    //   });
    // }
}
