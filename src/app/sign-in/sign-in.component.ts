import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, RouterOutlet, MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  names = "";
  userName = "";
  password = "";
  hide = true;
  constructor(private http: HttpClient) {

  }
  myFunction() {
    this.get();
  }
  public get() {
    let params = new HttpParams().set('userName', this.userName).set("password", this.password);

    this.http.post("http://localhost:8080/ZKart/signIn", params, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }).subscribe((d) => {
      console.log(d);
    })
  }
}
