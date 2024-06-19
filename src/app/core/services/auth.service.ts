import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../interfaces/auth/Login';
import baseUrl from '../helper/helper';
import { IRegistration } from '../interfaces/auth/Registration';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public regitration(userData: IRegistration) {
    return this.http.post(`${baseUrl}/users/register`, userData);
  }

  public login(userCredentials: Login) {
    return this.http.post(`${baseUrl}/users/login`, userCredentials);
  }
}
