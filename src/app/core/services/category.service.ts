import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategoriesResponse, ICategory, INewCategory } from '../interfaces/Categories';
import { Observable, map } from 'rxjs';
import baseUrl from '../helper/helper';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) { }

  newCategory(data: INewCategory) {
    return this.http.post(`${baseUrl}/categories`, data);
  }

  getCategories(): Observable<ICategory[]>{    
    return this.http.get<ICategoriesResponse>(`${baseUrl}/categories`).pipe(
      map(data => data.data.map((service: any) => ({
        ...service,
        state: service.state === 1 ? true : false
      })))
    );
  }

  getCategoryActive(): Observable<ICategory[]>{
    return this.http.get<ICategoriesResponse>(`${baseUrl}/categories/list/active`).pipe(
      map(data => data.data.map((service: any) => ({
        ...service,
        state: service.state === 1 ? true : false
      })))
    );
  }

  getCategoryById(id: string){
    return this.http.get(`${baseUrl}/categories/${id}`);
  }

  updateCategory(data: ICategory) {
    return this.http.put(`${baseUrl}/categories/${data.id}`, data);
  }

  deleteCategory(id: string) {
    return this.http.delete(`${baseUrl}/categories/${id}`);
  }
}
