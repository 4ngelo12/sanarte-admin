import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITopDaysReservationResponse, ITopServicesResponse } from '../interfaces/Home';
import baseUrl from '../helper/helper';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  getTopServices(){
    return this.http.get<ITopServicesResponse>(`${baseUrl}/top-services-last-month`);
  }

  getTopDaysReservation(){
    return this.http.get<ITopDaysReservationResponse>(`${baseUrl}/top-days-last-month`);
  }
}
