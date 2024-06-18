import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  //Guardar token de inicio de sesion
  public setToken(token: any) {
    localStorage.setItem('token', token);
    return true;
  }

  // Obtener token de inicio de sesion
  public getToken() {
    return localStorage.getItem('token');
  }

  // Eliminar token de inicio de sesion
  public deleteToken() {
    localStorage.removeItem('token');
  }

  // Validar la vigencia del token
  public validateToken(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    const tokenInfo = jwtDecode(token);
    const isTokenExpired: boolean = Date.now() >= tokenInfo['exp']! * 1000;
    
    if (isTokenExpired) this.deleteToken();
    return isTokenExpired;
  }

  public getUserInfo() {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    const tokenInfo = jwtDecode(token);
    return tokenInfo;
  }
}
