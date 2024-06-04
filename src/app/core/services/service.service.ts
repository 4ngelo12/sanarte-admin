import { Injectable } from '@angular/core';
import { IServicesResponse } from '../interfaces/Services';
import { Observable } from 'rxjs';
import baseUrl from '../helper/helper';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  getServices(): Observable<IServicesResponse[]>{    
    return this.http.get<IServicesResponse[]>(`${baseUrl}/services`);
  }
}
