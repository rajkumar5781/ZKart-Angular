import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-site-home',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './site-home.component.html',
  styleUrl: './site-home.component.css'
})
export class SiteHomeComponent {
  constructor(private router: Router) { }

  startShopping(){
    this.router.navigate(['home/shopping']);
  }
}
