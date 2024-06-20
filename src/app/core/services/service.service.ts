import { Injectable } from '@angular/core';
import { INewService, IService, IServicesResponse } from '../interfaces/Services';
import { Observable, map } from 'rxjs';
import baseUrl from '../helper/helper';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  newService(service: INewService){
    return this.http.post(`${baseUrl}/services`, service);
  }

  getServices(): Observable<IService[]>{    
    return this.http.get<IServicesResponse>(`${baseUrl}/services`).pipe(
      map(data => data.data.map((service: any) => ({
        ...service,
        state: service.state === 1 ? true : false
      })))
    );
  }

  getServiceActive(): Observable<IService[]>{
    return this.http.get<IServicesResponse>(`${baseUrl}/services/list/active`).pipe(
      map(data => data.data.map((service: any) => ({
        ...service,
        state: service.state === 1 ? true : false
      })))
    );
  }

  getServiceById(id: string): Observable<IService>{
    return this.http.get<IServicesResponse>(`${baseUrl}/services/${id}`).pipe(
      map((service: any) => ({
        ...service,
        state: service.state === 1 ? true : false
      }))
    );
  }



  updateService(data: IService) {
    return this.http.put(`${baseUrl}/services/${data.id}`, data);
  }

  deleteService(id: string) {
    return this.http.delete(`${baseUrl}/services/${id}`);
  }
}
