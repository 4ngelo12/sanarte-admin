import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IReservationCart } from '../interfaces/Reservations';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  constructor(private jwtHelper: JwtHelperService) { }

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
    localStorage.removeItem('role');
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

    // const tokenInfo = jwtDecode(token);
    const tokenInfo = this.jwtHelper.decodeToken(token);
    return tokenInfo;
  }

  public setRole(role: string) {
    localStorage.setItem('role', role);
  }

  public getRole() {
    return localStorage.getItem('role');
  }

  public insertReservationCart(reservation: IReservationCart) {
    const currentCart = sessionStorage.getItem('reservation_cart');
    console.log(currentCart);
    let cart: IReservationCart[] = [];

    if (currentCart) {
      cart = JSON.parse(currentCart);
    }

    cart.push(reservation);
    sessionStorage.setItem('reservation_cart', JSON.stringify(cart));
  }


  public getReservationCart(): IReservationCart[] {
    const currentCart = sessionStorage.getItem('reservation_cart');
    let cart: IReservationCart[] = [];

    if (currentCart) {
      cart = JSON.parse(currentCart);
    }

    return cart;
  }

  public deleteReservationCartById(id: string) {
    const currentCart = sessionStorage.getItem('reservation_cart');
    let cart: IReservationCart[] = [];

    if (currentCart) {
      cart = JSON.parse(currentCart);
    }

    cart = cart.filter((reservation) => reservation.id !== id);
    sessionStorage.setItem('reservation_cart', JSON.stringify(cart));
  }

  public deleteReservationCartAll() {
    sessionStorage.removeItem('reservation_cart');
  }
}
