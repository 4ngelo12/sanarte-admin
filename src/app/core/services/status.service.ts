import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStatusResponse } from '../interfaces/Status';
import { Observable } from 'rxjs';
import baseUrl from '../helper/helper';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(private http: HttpClient) { }

  getStatus(): Observable<IStatusResponse[]>{    
    return this.http.get<IStatusResponse[]>(`${baseUrl}/status`);
  }
}
