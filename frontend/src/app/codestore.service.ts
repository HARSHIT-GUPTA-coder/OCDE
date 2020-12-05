import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CodestoreService {
  code: string;
  id: string;
  constructor() { }

  getcode() {
    // this.id="";
    let c = this.code;
    // this.code="";
    return c;
  }

  getid() {
    return this.id;
  }
  setcode(i,c) {
    this.id = i;
    this.code = c;
  }
}
