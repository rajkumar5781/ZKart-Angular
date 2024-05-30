import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../state.service';

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
  role = '';
  constructor(private http: HttpClient,private router:Router,private activatedRoute : ActivatedRoute,private stateService: StateService) {
    if (this.activatedRoute.snapshot.queryParams['admin'] != null) {
      this.role = this.activatedRoute.snapshot.queryParams['admin'];
    }
  }
  myFunction() {
    this.get();
  }
  public get() {
    let params = new HttpParams().set('userName', this.userName).set("password", this.password);
    if(this.role.length>0){
      params = params.set("role","admin");
    }

    this.http.post<any>("http://localhost:8080/ZKart/signIn", params, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }).subscribe((d) => {
      console.log(d);
      localStorage.setItem("isAuthenticated","true");
      localStorage.setItem("authToken",d.authentication);
      localStorage.setItem("role",d.role);
      // this.stateService.setState({
      //   isAuthenticated: true,
      //   user: { id: userId.toString(), name: d.name, role: role },
      // });
      this.router.navigate(['/home/sitehome']);
    })
  }
}
