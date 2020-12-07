import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { NbToastrService, NbComponentStatus } from '@nebular/theme';
import { API } from '../API';

@Injectable({
  providedIn: 'root'
})
export class statementsFetchService {

  problemsURL = API.ServerURL + API.GetProblems;
  problemURL = API.ServerURL + API.GetProblem;
  submitURL = API.ServerURL + API.SubmitProblem;
  constructor(public toastrService: NbToastrService, private http: HttpClient) { }

  handleError(error: HttpErrorResponse, tserve: NbToastrService) {
    let status: NbComponentStatus ="danger";
    console.log(tserve)
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
      tserve.show(error.error.message, "Error", {status})
    } else {
      console.error('An error occurred:',error.error.message);
      tserve.show(error.error.message, "Error", {status})
    }
    return throwError(
      error.message || 'Something bad happened; please try again later.');
  }

  getProblems(): any {
    return this.http.get(this.problemsURL)
    .pipe(
      catchError((error):any => {this.handleError(error, this.toastrService)}).bind(this)
    )
  }

  getProblemStatement(pid): any {
    return this.http.post(this.problemURL, {id: pid}).pipe(
      catchError((error):any => {this.handleError(error, this.toastrService)}).bind(this)
    )
  }
  submitProblem(data): any {
    return this.http.post(this.submitURL, data).pipe(
      catchError((error):any => {this.handleError(error, this.toastrService)}).bind(this)
    )
  }
}
