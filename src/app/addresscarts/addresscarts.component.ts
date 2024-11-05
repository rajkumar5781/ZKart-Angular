import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../enviroment';

@Component({
  selector: 'app-addresscarts',
  standalone: true,
  imports: [MatIconModule, RouterOutlet, CommonModule],
  templateUrl: './addresscarts.component.html',
  styleUrl: './addresscarts.component.css',
})
export class AddresscartsComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  addressDetails: any = [];

  ngOnInit() {
    this.getAddressDetails();
  }

  goToAddAddress() {
    this.router.navigate(['/home/account/addresscarts/add']);
  }

  async getAddressDetails() {
    let url = environment.server+'/ZKart/AddressBook';

    const data = await firstValueFrom(this.http.get<any[]>(url));
    this.addressDetails = data;
  }

  editAddressCart(addressId: number) {
    this.router.navigate(['/home/account/addresscarts/edit', addressId]);
  }
  async deleteAddressCart(id: number) {
    let params = new HttpParams().set('id', id);
    let url = environment.server+'/ZKart/AddressBook';
    try {
       await firstValueFrom(
        this.http.delete<any[]>(url, {
          params: params,
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          responseType: 'text' as 'json', // Ensure proper response type
        })
      );
      await this.getAddressDetails();
    } catch (e) {
      console.log(e);
    }
  }

  async setAsDefault(id: number) {
    let defaultAddress: any = this.addressDetails.filter(
      (add: { default_address: string; '': any }) => {
        return add.default_address == 'true';
      }
    );
    let params = new HttpParams()
      .set('id', id)
      .set('actionType', 'set')
      .set('default', true)
      .set('defaultId', defaultAddress[0].id);
    let url = environment.server+'/ZKart/AddressBook';
    try {
      await firstValueFrom(
        this.http.post(url, params, {
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          responseType: 'text',
        })
      );
      await this.getAddressDetails();
    } catch (e) {
      console.log(e);
    }
  }
}
