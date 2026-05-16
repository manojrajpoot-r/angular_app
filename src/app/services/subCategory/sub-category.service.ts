
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SubCategoryService {

  private apiUrl = environment.apiUrl + '/SubCategory';

  constructor(private http: HttpClient) { }
  getSubCategorys(pageNumber: number, pageSize: number, search: string) {
    return this.http.get<any>(this.apiUrl, {
      params: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        search: search
      }
    });
  }


  getSubCategoryById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addSubCategory(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  updateSubCategory(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteSubCategory(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // frontend
  getAllSubCategories() {

    return this.http.get(
      `${this.apiUrl}/frontend`
    );

  }

}
