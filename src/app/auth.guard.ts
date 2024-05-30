import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if(isLoggedIn()){
    return true;
  }
  else{
    router.navigate(['/signin']);
    return false;
  }
};

function isLoggedIn() {
  return checkAuthentication();
}

export function checkAuthentication(): boolean {
  return (typeof localStorage !== 'undefined' && localStorage.getItem('isAuthenticated') !== null);
}

export function getUserId() : number{
  if(checkAuthentication()){
    return Number(localStorage.getItem("userId"));
  }
  return NaN;
}

export function getRole() : string{
  if(checkAuthentication()){
    return localStorage.getItem("role") || "customer";
  }
  return "customer";
}

export function isAdmin(){
  return getRole()=="admin";
}

export function isCustomer(){
  return !getRole();
}
