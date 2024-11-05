import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { environment } from '../../../enviroment';

@Component({
  selector: 'app-signup',
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
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  names = '';
  userName = '';
  password = '';
  phoneNum = '';
  lastName = '';
  hide = true;
  role = '';
  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location:Location
  ) {
    if (this.activatedRoute.snapshot.queryParams['admin'] != null) {
      this.role = "admin";
    }
    let path = this.location.path();
    const segments = path.split('/');
      const lastSegment = segments[1];
      if(lastSegment=="vender"){
        this.role = "vender";
      }
  }
  myFunction() {
    this.get();
  }
  public get() {
    let params = new HttpParams()
      .set('userName', this.userName)
      .set('password', this.password)
      .set('name', this.names)
      .set('lastName', this.lastName)
      .set('phone', this.phoneNum);

      if(this.role.length > 0){
        params = params.set("role",this.role);
      }

    this.http
      .post(environment.server+'/ZKart/signup', params, {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
        responseType: 'text',
      })
      .subscribe((d) => {
        alert('Signup success');
        if(this.role == "vender"){
          this.router.navigate(['/vender/signin']);
        }
        else if(this.role=="admin"){
          this.router.navigate(['/signin'],{ queryParams: { role: this.role } });
        }
        else{
          this.router.navigate(['/signin']);
        }
      });
  }
}
