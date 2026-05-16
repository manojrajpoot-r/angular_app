
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  private apiUrl = environment.apiUrl + '/Category';

  constructor(private http: HttpClient) { }
  getCategorys(pageNumber: number, pageSize: number, search: string) {
    return this.http.get<any>(this.apiUrl, {
      params: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        search: search
      }
    });
  }

  getCategoryById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addCategory(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  updateCategory(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getAllCategories() {
    return this.http.get(`${this.apiUrl}/frontend`);

  }
}
