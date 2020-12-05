import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { fileInterface, TreeNode } from './fileInterface';
import { API } from '../API';
import { CodestoreService } from './codestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbComponentStatus } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class CodefetchService {
  private structURL = API.ServerURL + API.GetStructure;
  private createURL = API.ServerURL + API.CreateFile;
  private codeURL = API.ServerURL + API.ReadFile;
  private deleteUrl = API.ServerURL + API.DeleteFile;
  private folderURL = API.ServerURL + API.GetFolders;
  private updateURL = API.ServerURL + API.UpdateFile;
  constructor(private toastrService: NbToastrService, private http: HttpClient, private _codestore: CodestoreService, private router: Router, private activerouter: ActivatedRoute) { }
  
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
  
  getFileList(): any {
    return this.http.get(this.structURL)
    .pipe(
      catchError((error):any => {this.handleError(error, this.toastrService)}).bind(this)
    )
  }

  readfiledata(id: string): any {
    return this.http.post(this.codeURL,{file_id: id}).pipe(
      catchError((error):any => {this.handleError(error, this.toastrService)}).bind(this)
    )
  }

  readfile(id: string): any{
    return this.readfiledata(id).subscribe(
      _data => {
        if(_data["success"]==false) {
          this.handleError(_data["message"], this.toastrService)
        }
        else {
          this._codestore.setcode(id, _data["data"]);
          console.log(id)
          this.router.navigate(['/dashboard/editor', {id: id}])
          // window.location.
          // console.log(_data)
        }
      }
    )
  }

  updatefile(id: string, data: string): any {
    return this.http.post(this.updateURL, {file_id: id, data: data}).pipe(
      catchError((error):any => {this.handleError(error, this.toastrService)}).bind(this)
    ).subscribe(
      _data => {
        if(_data["success"]==false) {
          this.handleError(_data["message"], this.toastrService)
        }
        else {
        console.log(_data["message"])
        }
    }
    )
  }
  deletefile(id: string): any{
    console.log(this.toastrService)
    console.log(id)
    return this.http.post(this.deleteUrl, {file_id: id}).pipe(
      catchError((error):any => {this.handleError(error, this.toastrService)}).bind(this)
    ).subscribe(
      _data => {
        if(_data["success"]==false) {
          this.handleError(_data["message"], this.toastrService)
          let status:NbComponentStatus = "danger";
          this.toastrService.show(_data["message"], "Error", {status})
        }
        else {
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
        catchError((error):any => {this.handleError(error, this.toastrService)}).bind(this)
      ).subscribe(
        _data => {
          if(_data["success"]==false) {
            this.handleError(_data["message"], this.toastrService)
          }
          else {
          window.location.reload();
          console.log(_data)
          }
        }
      )
  }

  getFolder() {
    return this.http.get(this.folderURL)
    .pipe(
      catchError((error):any => {this.handleError(error, this.toastrService)}).bind(this)
    )
  }
}
