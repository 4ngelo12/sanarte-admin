import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INewReservation, IReservation, IReservationResponse } from '../interfaces/Reservations';
import baseUrl from '../helper/helper';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient) { }

  newReservation(data: INewReservation) {
    return this.http.post(`${baseUrl}/reservations`, data);
  }

  getReservations(): Observable<IReservationResponse[]>{    
    return this.http.get<IReservationResponse[]>(`${baseUrl}/reservations`);
  }

  getReservationById(id: string){
    return this.http.get(`${baseUrl}/reservations/${id}`);
  }

  updateReservation(data: IReservation) {
    return this.http.patch(`${baseUrl}/reservations/${data.id}`, data);
  }

  deleteReservation(id: string) {
    return this.http.delete(`${baseUrl}/reservations/${id}`);
  }
}
