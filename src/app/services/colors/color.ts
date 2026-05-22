
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ColorService {

  private apiUrl = environment.apiUrl + '/color';

  constructor(private http: HttpClient) { }

  getColors(
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

  getColorById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addColor(data: any) {
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  updateColor(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/update`, data);
  }

  deleteColor(id: number) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  statusColor(id: number) {
    return this.http.get(`${this.apiUrl}/status/${id}`);
  }

  getAllColors() {
    return this.http.get(`${this.apiUrl}/frontend`);

  }
}
