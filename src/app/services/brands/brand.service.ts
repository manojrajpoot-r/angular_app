
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BrandService {

  private apiUrl = environment.apiUrl + '/Brands';

  constructor(private http: HttpClient) { }
  getBrands(pageNumber: number, pageSize: number, search: string) {
    return this.http.get<any>(this.apiUrl, {
      params: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        search: search
      }
    });
  }


  getBrandById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addBrand(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  updateBrand(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteBrand(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // frontend
  getAllBrands() {

    return this.http.get(
      `${this.apiUrl}/frontend`
    );

  }

}
