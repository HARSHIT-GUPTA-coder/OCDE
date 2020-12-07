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
  contestsURL = API.ServerURL + API.GetContests;
  submitURL = API.ServerURL + API.SubmitProblem;
  submissionURL = API.ServerURL + API.GetSubmissions;
  scoreURL = API.ServerURL + API.GetScores;
  contestScoreURL = API.ServerURL + API.GetContestScores;
  contestURL = API.ServerURL + API.GetContest;
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

  getProblems(data): any {
    return this.http.post(this.problemsURL, data)
    .pipe(
      catchError((error):any => {this.handleError(error, this.toastrService)}).bind(this)
    )
  }

  getContests(data): any {
    return this.http.post(this.contestsURL, data)
    .pipe(
      catchError((error):any => {this.handleError(error, this.toastrService)}).bind(this)
    )
  }
  getContest(data): any {
    return this.http.post(this.contestURL, data)
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

  getSubmissions(data): any {
    return this.http.post(this.submissionURL, data).pipe(
      catchError((error):any => {this.handleError(error, this.toastrService)}).bind(this)
    )
  }
  getScores(data): any {
    return this.http.post(this.scoreURL, data).pipe(
      catchError((error):any => {this.handleError(error, this.toastrService)}).bind(this)
    )
  }
  getContestScores(data): any {
    return this.http.post(this.contestScoreURL, data).pipe(
      catchError((error):any => {this.handleError(error, this.toastrService)}).bind(this)
    )
  }
}
