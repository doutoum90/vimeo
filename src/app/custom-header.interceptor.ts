import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class CustomHeaderInterceptor implements HttpInterceptor {
    private accessToken = '9f2bbe6d034faa6c6d78d0e5e4077bdc';
    constructor(private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.handleAccess(request, next).pipe(catchError(err => this.handleError(err, this.router)));
    }

    private handleAccess(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(
            request.clone({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.vimeo.*+json;version=3.4',
                    'Authorization': `Bearer ${this.accessToken}`
                })
            })
        );


    }

    private handleError(error: HttpErrorResponse, router: Router) {
        if (error.status == 401) {
            localStorage.clear();
        }
        return throwError('Something bad happened; please try again later.');
    };

}