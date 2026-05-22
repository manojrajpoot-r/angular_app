
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SizeService {

  private apiUrl = environment.apiUrl + '/size';

  constructor(private http: HttpClient) { }



  getSizes(
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

  getSizeById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addSize(data: any) {
    return this.http.post(`${this.apiUrl}/add`, data);
  }



  updateSize(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/update`, data);
  }


  deleteSize(id: number) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
  statusSize(id: number) {
    return this.http.delete(`${this.apiUrl}/status/${id}`);
  }

  getAllSizes() {
    return this.http.get(`${this.apiUrl}/frontend`);

  }
}
