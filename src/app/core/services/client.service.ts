import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IClient, IClientsResponse, INewClient } from '../interfaces/Clients';
import baseUrl from '../helper/helper';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  newClient(data: INewClient) {
    return this.http.post(`${baseUrl}/clients`, data);
  }

  getClients(): Observable<IClient[]> {
    return this.http.get<IClientsResponse>(`${baseUrl}/clients`).pipe(
      map(data => data.data.map((service: any) => ({
        ...service,
        state: service.state === 1 ? true : false
      })))
    );;
  }

  getClientActive(): Observable<IClient[]> {
    return this.http.get<IClientsResponse>(`${baseUrl}/clients/list/active`).pipe(
      map(data => data.data.map((service: any) => ({
        ...service,
        state: service.state === 1 ? true : false
      })))
    );
  }

  getClientById(id: string) {
    return this.http.get(`${baseUrl}/clients/${id}`);
  }

  updateClient(data: IClient) {
    return this.http.put(`${baseUrl}/clients/${data.id}`, data);
  }

  deleteClient(id: string) {
    return this.http.delete(`${baseUrl}/clients/${id}`);
  }
}
