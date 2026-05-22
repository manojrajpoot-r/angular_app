
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private apiUrl = environment.apiUrl + '/Products';
  constructor(private http: HttpClient) { }
  getProducts(pageNumber: number, pageSize: number, search: string) {

    return this.http.get<any>(this.apiUrl, {
      params: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        search: search
      }
    });


  }


  getProductById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addProduct(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  updateProduct(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getFeaturedProducts() {
    return this.http.get(`${this.apiUrl}/featured`);
  }

  getlatestProducts() {
    return this.http.get(`${this.apiUrl}/latest`);
  }

  getProductBySlug(slug: any) {
    return this.http.get(
      `${this.apiUrl}/slug/${slug}`
    );

  }

  getRelatedProducts(categoryId: number, productId: number) {
    return this.http.get(
      `${this.apiUrl}/related/${categoryId}/${productId}`
    );
  }

  filterProducts(data: any) {
    return this.http.post(
      `${this.apiUrl}/filter`,
      data
    );

  }
  getHomeCategoryProducts() {

    return this.http.get<any>(`${this.apiUrl}/home-category-products`
    );

  }

}


