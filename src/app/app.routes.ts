import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { AppHelloWorldComponent } from './app-hello-world/app-hello-world.component';
import { ShoppingComponent } from './shopping/shopping.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { SiteHomeComponent } from './site-home/site-home.component';
import { AccountComponent } from './account/account.component';
import { ContactComponent } from './contact/contact.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { AddToCartComponent } from './add-to-cart/add-to-cart.component';
import { AddReviewComponent } from './add-review/add-review.component';
import { OrderhistoryComponent } from './orderhistory/orderhistory.component';
import { NgModule } from '@angular/core';
import { authGuard } from './auth.guard';
import { ReviewhistoryComponent } from './reviewhistory/reviewhistory.component';
import { AddresscartsComponent } from './addresscarts/addresscarts.component';
import { AddressbookformComponent } from './addressbookform/addressbookform.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  {
    path: 'signin',
    component: SignInComponent,
    children: [{ path: 'helloWorld', component: AppHelloWorldComponent }],
  },
  { path: 'helloWorld', component: AppHelloWorldComponent },
  // { path: 'shopping', component: ShoppingComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'shopping',
        component: ShoppingComponent,
        // children:[{ path: 'addreview', component: AddReviewComponent }]
      },
      { path: 'sitehome', component: SiteHomeComponent },
      { path: 'account', component: AccountComponent,canActivate:[authGuard]},
      { path: 'account/orderhistory', component: OrderhistoryComponent,canActivate:[authGuard] },
      { path: 'contact', component: ContactComponent },
      { path: 'shopping/product/:id', component: ProductDetailsComponent },
      // { path: 'shopping/product/buy/:id', component: ProductBuyComponent,canActivate:[authGuard] },
      { path: 'shopping/addreview/:id', component: AddReviewComponent,canActivate:[authGuard], data: { action: 'addreview' } },
      { path: 'shopping/editreview/:id', component: AddReviewComponent,canActivate:[authGuard], data: { action: 'editreview' } },
      { path: 'account/addtocart', component: AddToCartComponent , canActivate:[authGuard]},
      { path: 'account/accountdetails', component: CustomerDetailsComponent , canActivate:[authGuard]},
      { path: 'account/reviewhistory', component: ReviewhistoryComponent , canActivate:[authGuard]},
      { path: 'account/addresscarts', component: AddresscartsComponent , canActivate:[authGuard]},
      { path: 'account/addresscarts/add', component: AddressbookformComponent , canActivate:[authGuard]},
      { path: 'account/addresscarts/edit/:id', component: AddressbookformComponent , canActivate:[authGuard]},
      { path: 'ecommerce/addproduct', component: AddProductComponent , canActivate:[authGuard]},
      { path: 'dashboard', component: AdminDashboardComponent , canActivate:[authGuard]}
    ],
  },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: '/home/sitehome', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
