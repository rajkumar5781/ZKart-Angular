import {  inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';

// export const authGuard: CanActivateFn = (route, state) => {
//   doing().subscribe((d)=>{
//     console.log(d);
//   })
//   const router = inject(Router);

//   if(isLoggedIn() && isCustomer()){
//     return true;
//   }
//   else if(isLoggedIn() && isAdmin()){
//     router.navigate(['/home/dashboard']);
//     return false;
//   }
//   else{
//     // router.navigate(['/signin']);
//     // router.createUrlTree(['/signin']);
//     return router.createUrlTree(['/signin']);
//   }
//   // return false;
// };

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  return doing().pipe(
    map((isAuthenticated: any) => {
      if (isAuthenticated && isCustomer()) {
        return true;
      } else if (isAuthenticated && isAdmin()) {
        router.navigate(['/home/dashboard']);
        return false;
      } else if (!isAuthenticated) {
        return router.createUrlTree(['/signin']);
      }
      return false;
    })
  );
};

export class CustomerGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree>|boolean|UrlTree|Promise<boolean|UrlTree> {
      if(isLoggedIn() && isCustomer()){
        return true;
      }
      else if(isLoggedIn() && isAdmin()){
        this.router.navigate(['/home/dashboard']);
        return false;
      }
      else if(!isLoggedIn()){
        this.router.navigate(['/signin']);
        return false;
      }
      return false;
  }
}


export const adminAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if(isLoggedIn() && isAdmin()){
    return true;
  }
  else if(isLoggedIn() && isCustomer()){
    router.navigate(['home/sitehome']);
    return false;
  }
  else{
    // router.navigate(['/signin']);
    // router.createUrlTree(['/signin']);
    return false;
  }
};


function isLoggedIn() {
  return checkAuthentication();
}

export function checkAuthentication(): boolean {
  return (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('isAuthenticated') !== null);
}

export function getUserId() : number{
  if(checkAuthentication()){
    return Number(sessionStorage.getItem("userId"));
  }
  return NaN;
}

export function getRole() : string{
  if(checkAuthentication()){
    return sessionStorage.getItem("role") || "customer";
  }
  return "customer";
}

export function isAdmin(){
  return getRole()=="admin";
}

export function isVender(){
  return getRole()=="vender";
}

export function isCustomer(){
  return !isAdmin();
}

// export function doing():Observable<any>{
//   if(checkAuthentication()){
//     return of(sessionStorage);
//   }
//   return of();
// }

export function doing(): Observable<boolean> {
  return new Observable<boolean>(observer => {
    // Simulate an async operation (like a HTTP request)
    // setTimeout(() => {
      const isAuthenticated = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('isAuthenticated') !== null;
      observer.next(isAuthenticated);
      observer.complete();
    // }, 0);
  });
}

// export function doing1(): Observable<boolean> {
//   return new Observable<boolean>(observer => {
//     setTimeout(() => {
//       const isAuthenticated = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('isAuthenticated') !== null;
//       observer.next(true);
//       observer.complete();
//     }, 10);
//   });
// }