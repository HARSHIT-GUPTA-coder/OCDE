import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CodefetchService } from './codefetch.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectpartService {
  private callback;
  private active;
  constructor(private location: Router, private _fileService: CodefetchService) { 
    this.location.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  buildTable(): any {
    this.callback();
    // this._fileService.getFileList().subscribe(
    //   _data => {
    //     console.log(_data);
    //     if(_data["success"]==false) {
    //       console.error(
    //         _data["message"]
    //       );
    //     }
    //     else {
    //       console.log("success");
    //       if(this.callback != null)
    //         this.callback(_data["structure"],this.active);
    //     }
    //   }
    // );
  }

  changeFile(id) {
    this._fileService.readfiledata(id).subscribe(
      _data => {
        if(_data["success"]==false) {
          this._fileService.handleError(_data["message"],this._fileService.toastrService);
        }
        else {
          this.location.navigate(['/dashboard/editor', {id: id}])
          // window.location.reload();
        }
      }
    )
  }
  
  setcallback(C) {
    this.callback = C;
  }

  setactivefile(f) {
    this.active = f;
  }
}
