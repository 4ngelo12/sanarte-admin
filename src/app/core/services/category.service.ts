import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategoriesResponse } from '../interfaces/Categories';
import { Observable } from 'rxjs';
import baseUrl from '../helper/helper';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) { }

  getCategories(): Observable<ICategoriesResponse[]>{    
    return this.http.get<ICategoriesResponse[]>(`${baseUrl}/categories`);
  }
}
