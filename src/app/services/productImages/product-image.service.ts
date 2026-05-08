
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductImageService {

  private apiUrl = environment.apiUrl + '/ProductImage';
  constructor(private http: HttpClient) { }
  getProductImages(
    productId: number,
    pageNumber: number,
    pageSize: number,
    search: string
  ) {

    return this.http.get<any>(this.apiUrl, {

      params: {

        productId: productId,

        pageNumber: pageNumber,

        pageSize: pageSize,

        search: search
      }
    });

  }


  addProductImage(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }



  deleteProductImage(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }



}

