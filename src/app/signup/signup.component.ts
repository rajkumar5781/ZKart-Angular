import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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
    private activatedRoute: ActivatedRoute
  ) {
    if (this.activatedRoute.snapshot.queryParams['admin'] != null) {
      this.role = this.activatedRoute.snapshot.queryParams['admin'];
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
        params = params.set("role","admin");
      }

    this.http
      .post('http://localhost:8080/ZKart/signup', params, {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
        responseType: 'text',
      })
      .subscribe((d) => {
        console.log(d);
        this.router.navigate(['/signin']);
      });
  }
}
