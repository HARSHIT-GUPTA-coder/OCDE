import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { fileInterface, TreeNode } from './fileInterface';
import { API } from '../API';

@Injectable({
  providedIn: 'root'
})
export class CodefetchService {
  private structURL = API.ServerURL + API.GetStructure;
  private createURL = API.ServerURL + API.CreateFile;
  private codeURL = API.ServerURL + API.ReadFile;
  private deleteUrl = API.ServerURL + API.DeleteFile;
  constructor(private http: HttpClient) { }
  
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error('An error occurred:',error);
    }
    return throwError(
      error.message || 'Something bad happened; please try again later.');
  }
  
  getFileList(): any {
    return this.http.get<TreeNode<fileInterface>[]>(this.structURL)
    .pipe(
      catchError(this.handleError)
    )
  }

  readfile(id: string): any{
    let params = new HttpParams().set("file_id",id);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.codeURL,{headers: headers, params: params}).pipe(
      catchError(this.handleError)
    ).subscribe(
      _data => {
        if(_data["success"]==false) {
          this.handleError(_data["message"])
        }
        else {
        // window.location.reload();
        console.log(_data)
        }
      }
    )
  }

  deletefile(id: string): any{
    console.log(id)
    return this.http.post(this.deleteUrl, {file_id: id}).pipe(
      catchError(this.handleError)
    ).subscribe(
      _data => {
        if(_data["success"]==false) {
          this.handleError(_data["message"])
        }
        else {
        window.location.reload();
        console.log(_data)
        }
      }
    )
  }

  createFile(parent: string, name: string, isFile: boolean) {
      var data = {
        'filename': name,
        'parent': parent,
        'is_file': isFile,

      }
      this.http.post(this.createURL,data).pipe(
        catchError(this.handleError)
      ).subscribe(
        _data => {
          if(_data["success"]==false) {
            this.handleError(_data["message"])
          }
          else {
          window.location.reload();
          console.log(_data)
          }
        }
      )
  }

}
