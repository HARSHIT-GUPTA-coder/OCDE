import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { fileInterface, TreeNode } from './fileInterface';
import { API } from '../API';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbComponentStatus, NbDialogService } from '@nebular/theme';
import { map } from 'rxjs/internal/operators';
import { ConfirmDialog } from './confirmdialog/confirmdialog.component';

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
  private filesURL = API.ServerURL + API.GetFiles;
  constructor(public toastrService: NbToastrService,
              private http: HttpClient,
              private router: Router,
              private activerouter: ActivatedRoute,
              private _dialogService: NbDialogService) { }

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
  getFiles(): any {
    return this.http.get(this.filesURL)
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
    this.router.navigate(['/dashboard/editor', {id: id}]);
    // return this.readfiledata(id).subscribe(
    //   _data => {
    //     if(_data["success"]==false) {
    //       this.handleError(_data["message"], this.toastrService)
    //     }
    //     else {
    //       this._codestore.setcode(id, _data["data"]);
    //       // console.log(id);
    //     }
    //   }
    // )
  }

  updatefile(id: string, data: string): any {
    return this.http.post(this.updateURL, {file_id: id, data: data}).pipe(
      catchError((error):any => {this.handleError(error, this.toastrService)}).bind(this)
    ).subscribe(
      _data => {
        if(_data["success"]==false) {
          this.handleError(_data["message"], this.toastrService);
        }
        else {
        console.log(_data["message"]);
        }
    }
    )
  }
  renamefile(id: string, name: string): Promise<any> {
    return this.http.post(this.updateURL, {file_id: id, filename: name}).pipe(
      catchError((error):any => {this.handleError(error, this.toastrService)}).bind(this)
    ).pipe(map(
      _data => {
        if(_data["success"]==false) {
          this.handleError(_data["message"], this.toastrService);
          return false;
        }
        else {
          // window.location.reload();
          console.log(_data["message"]);
          return true;
        }
    }
    )).toPromise();
  }
  deletefile(id: string): Promise<any> {
    return this._dialogService.open(ConfirmDialog, {context: "d"}).onClose.pipe(map(res => {
      if (res) {
        return this.http.post(this.deleteUrl, {file_id: id}).pipe(
          catchError((error):any => {this.handleError(error, this.toastrService)}).bind(this)
        ).pipe(map(_data => {
            if(_data["success"]==false) {
              this.handleError(_data["message"], this.toastrService);
              let status:NbComponentStatus = "danger";
              this.toastrService.show(_data["message"], "Error", {status});
              return false;
            }
            else {
              // window.location.reload();
              console.log(_data);
              return true;
            }
          }
        )).toPromise();
      }
      else {
        return false;
      }
    })).toPromise();
  }

  createFile(parent: string, name: string, isFile: boolean): Promise<any> {
      var data = {
        'filename': name,
        'parent': parent,
        'is_file': isFile,

      }
      return this.http.post(this.createURL,data).pipe(
        catchError((error):any => {this.handleError(error, this.toastrService)}).bind(this)
      ).pipe(map(_data => {
        if(_data["success"]==false) {
          this.handleError(_data["message"], this.toastrService);
          return false;
        }
        else {
        // window.location.reload();
          console.log(_data);
          return _data["file_id"];
        }
      })).toPromise();
  }

  getFolder() {
    return this.http.get(this.folderURL)
    .pipe(
      catchError((error):any => {this.handleError(error, this.toastrService)}).bind(this)
    )
  }
}
// export interface FileAPI {
//   success?: boolean;
//   message?: string;
//   size?: any;
//   file_id?: any;
//   data?: any;
// }
