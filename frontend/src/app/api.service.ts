import { Injectable } from '@angular/core';
import { User, SignUpForm, LoginForm } from './UserDetails';
import { HttpClient, HttpHeaders, HttpClientXsrfModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import {API} from '../API';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _url: string = API.ServerURL;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) {}

  registerUser(data: SignUpForm) : Observable<User> {
    return this.http.post<User>(this._url + API.Register, data, this.httpOptions);
  }
  loginUser(data: LoginForm) : Observable<User> {
    return this.http.post<User>(this._url + API.Login, data, this.httpOptions);
  }
  logoutUser() {
    return this.http.get(this._url + API.Logout);
  }

}
