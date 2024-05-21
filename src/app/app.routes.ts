import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { AppHelloWorldComponent } from './app-hello-world/app-hello-world.component';
import { ShoppingComponent } from './shopping/shopping.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { SiteHomeComponent } from './site-home/site-home.component';
import { AccountComponent } from './account/account.component';
import { ContactComponent } from './contact/contact.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

export const routes: Routes = [
  {
    path: 'signin',
    component: SignInComponent,
    children: [{ path: 'helloWorld', component: AppHelloWorldComponent }],
  },
  { path: 'helloWorld', component: AppHelloWorldComponent },
  { path: 'shopping', component: ShoppingComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'shopping',
        component: ShoppingComponent,
      },
      { path: 'sitehome', component: SiteHomeComponent },
      { path: 'account', component: AccountComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'shopping/product/:id', component: ProductDetailsComponent },
    ],
  },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: '/home/sitehome', pathMatch: 'full' },
];
