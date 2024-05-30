import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let authToken : any;
  if(typeof localStorage !== 'undefined' && localStorage.getItem('authToken') !== null){
    authToken = localStorage.getItem('authToken')
  }
  

  if (authToken) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
