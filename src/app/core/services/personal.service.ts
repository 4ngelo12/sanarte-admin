import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INewPersonal, IPersonal, IPersonalResponse } from '../interfaces/Personal';
import baseUrl from '../helper/helper';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  constructor(private http: HttpClient) { }

  newPersonal(personal: INewPersonal) {
    return this.http.post(`${baseUrl}/personal`, personal);
  }

  getPersonal(): Observable<IPersonal[]> {
    return this.http.get<IPersonalResponse>(`${baseUrl}/personal`).pipe(
      map(data => data.data.map((personal: any) => ({
        ...personal,
        status: personal.status === 1 ? true : false
      })))
    );;
  }

  getPersonalActiveByServiceId(id: string): Observable<IPersonal[]> {
    return this.http.get<IPersonalResponse>(`${baseUrl}/personal/list/active/${id}`).pipe(
      map(response => {
        if (response.data) {
          return response.data.map((personal: any) => ({
            ...personal,
            status: personal.status === 1
          }));
        } else {
          throw new Error(response.message || 'No options available');
        }
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
/*
  getPersonalActiveByServiceId(id: string): Observable<IPersonal[]> {
    return this.http.get<IPersonalResponse>(`${baseUrl}/personal/list/active/${id}`).pipe(
      map(data => data.data.map((personal: any) => ({
        ...personal,
        status: personal.status === 1 ? true : false
      })
    ))
    );
  }
    */

  getPersonalById(id: string): Observable<IPersonal> {
    return this.http.get<IPersonalResponse>(`${baseUrl}/personal/${id}`).pipe(
      map((personal: any) => ({
        ...personal,
        status: personal.status === 1 ? true : false
      }))
    );
  }

  updatePersonal(data: IPersonal) {
    return this.http.patch(`${baseUrl}/personal/${data.id}`, data);
  }

  deletePersonal(id: string) {
    return this.http.delete(`${baseUrl}/personal/${id}`);
  }
}
