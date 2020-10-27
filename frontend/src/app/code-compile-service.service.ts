import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { code_interface, output_interface } from './code_interface';
import { API } from '../API';

@Injectable({
  providedIn: 'root'
})

export class CodeService {
  private postUrl = API.ServerURL + API.compile;
  constructor(private http: HttpClient) { }
  
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `message was: ${error.message}`);
    }
    return throwError(
      error.message || 'Something bad happened; please try again later.');
  }
  

  postData(data: code_interface): Observable<output_interface> {
    return this.http.post<output_interface>(this.postUrl, data)
    .pipe(
      catchError(this.handleError)
    )
  }
}