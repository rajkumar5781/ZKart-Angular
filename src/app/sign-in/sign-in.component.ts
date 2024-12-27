import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../state.service';
import { firstValueFrom } from 'rxjs';
import { Location } from '@angular/common';
import { environment } from '../../../enviroment';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  names = '';
  userName = '';
  password = '';
  hide = true;
  role = '';
  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private stateService: StateService,
    private location : Location
  ) {
    if (this.activatedRoute.snapshot.queryParams['admin'] != null) {
      this.role = this.activatedRoute.snapshot.queryParams['admin'];
      this.role = "admin";
    }
    const path = this.location.path();
      const segments = path.split('/');
      const lastSegment = segments[1];
      if(lastSegment=="vender"){
        this.role = "vender";
      }
  }
  myFunction() {
    this.get();
  }
  public async get() {
    let params = new HttpParams()
      .set('userName', this.userName)
      .set('password', this.password);
    if (this.role.length > 0) {
      params = params.set('role', this.role);
    }
    try {
      let url = environment.server+'/ZKart/signIn';
      let data = await firstValueFrom(
        this.http.post<any>(url, params, {
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          withCredentials: true
        })
      );
      // localStorage.setItem('isAuthenticated', 'true');
    // localStorage.setItem('authToken', data.authentication);
      // localStorage.setItem('role', data.role);
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('authToken', data.authentication);
      sessionStorage.setItem('role', data.role);
      if (data.role == 'customer') {
        this.router.navigate(['/home/sitehome']);
      } else {
        this.router.navigate(['/home/dashboard']);
        // window.location.reload();
      }
    } catch (e: any) {
      alert(e.error.message);
    }
  }
  createAccount(event : Event){
    event.preventDefault();
    if(this.role == "vender"){
      this.router.navigate(['/vender/signup']);
    }
    else if(this.role=="admin"){
      this.router.navigate(['/signup'],{ queryParams: { role: this.role } });
    }
    else{
      this.router.navigate(['/signup']);
    }
  }
}
