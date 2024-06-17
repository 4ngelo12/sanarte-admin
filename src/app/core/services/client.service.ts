import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IClient, IClientsResponse, INewClient } from '../interfaces/Clients';
import baseUrl from '../helper/helper';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  newClient(data: INewClient) {
    return this.http.post(`${baseUrl}/clients`, data);
  }

  getClients(): Observable<IClientsResponse[]>{    
    return this.http.get<IClientsResponse[]>(`${baseUrl}/clients`);
  }

  getClientById(id: string){
    return this.http.get(`${baseUrl}/clients/${id}`);
  }

  updateClient(data: IClient) {
    return this.http.put(`${baseUrl}/clients/${data.id}`, data);
  }

  deleteClient(id: string) {
    return this.http.delete(`${baseUrl}/clients/${id}`);
  }
}
