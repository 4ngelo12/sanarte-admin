import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../interfaces/Login';
import baseUrl from '../helper/helper';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public login(userCredentials: Login) {
    return this.http.post(`${baseUrl}/users/login`, userCredentials);
  }
}
