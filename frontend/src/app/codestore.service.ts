import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CodestoreService {
  code: string;
  id: string;
  constructor() { }

  getcode() {
    return this.code;
  }

  getid() {
    return this.id;
  }
  setcode(i,c) {
    this.id = i;
    this.code = c;
  }
}
