import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from '../helper/helper';
import { Observable, map } from 'rxjs';
import { IUserUpdate, IUsers, IUsersResponse } from '../interfaces/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsers(id: string): Observable<IUsers[]> {
    return this.http.get<IUsersResponse>(`${baseUrl}/users/list/${id}`)
      .pipe(map(data => data.data.map((user: any) => ({
        ...user,
        state: user.state === 1 ? true : false
      }))));
  }

  getUserId(id: string) {
    return this.http.get(`${baseUrl}/users/${id}`);
  }

  updateUser(user: IUserUpdate) {
    return this.http.patch(`${baseUrl}/users/${user.id}`, user);
  }

  deleteUser(id: string) {
    return this.http.delete(`${baseUrl}/users/${id}`);
  }
}
