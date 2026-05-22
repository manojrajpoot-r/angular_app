
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductVarientServiceService {

  private apiUrl = environment.apiUrl + '/ProductVariant';

  constructor(private http: HttpClient) { }




  getproductVarients(
    pageNumber: number,
    pageSize: number,
    search: string
  ) {

    return this.http.post<any>(
      `${this.apiUrl}/list`,
      {
        pageNumber: pageNumber,
        pageSize: pageSize,
        search: search
      }
    );
  }
  getProductVarientById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addProductVarient(data: any) {
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  updateProductVarient(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/update`, data);
  }

  deleteProductVarient(id: number) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
  statusProductVarient(id: number) {
    return this.http.delete(`${this.apiUrl}/status/${id}`);
  }
  getAllProductVarients() {
    return this.http.get(`${this.apiUrl}/frontend`);

  }
}
