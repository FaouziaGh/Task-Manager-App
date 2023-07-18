import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, empty, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import {catchError, switchMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebRequestInterceptorService implements HttpInterceptor{

  constructor(private authService: AuthService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any>{
    // Handle the request
    request = this.addAuthHeader(request)
    // call next()
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) =>{
        console.log(error);
        if(error.status=== 401){
          return this.refreshAccsesToken().pipe(
            switchMap(() => {
              request = this.addAuthHeader(request)
              return next.handle(request)
            }),
            catchError((err: any)=>{
              console.log(err);
              this.authService.logout()
              return empty()
              
            })
          )
         // this.authService.logout()
        }
        return throwError(error)
      })
    )
  }
  refreshAccsesToken(){
    return this.authService.getNewAccessToken().pipe(
      tap(()=>{
        console.log("Access token refreshed");
        
      })
    )
  }

  addAuthHeader(request: HttpRequest<any>){
    //get the access token
    const token = this.authService.getAccessToken()
    if(token){
      return request.clone({
        setHeaders:{
          'x-access-token': token
        }
      })
    }
    return request;
  }
}
