// Authentication service for managing user authentication and authorization

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {

  }

  login(){
    return this.http.get('api/login', {withCredentials: true});
  }

  logout(){
    return this.http.get('api/logout', {withCredentials: true});
  }
}
