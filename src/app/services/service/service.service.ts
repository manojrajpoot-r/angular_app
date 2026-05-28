
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ServiceSevice {

  private apiUrl = environment.apiUrl + '/services';

  constructor(private http: HttpClient) { }

  getloadServices(
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

  getServiceById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addService(data: any) {
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  updateService(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/update`, data);
  }

  deleteService(id: number) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  statusService(id: number) {
    return this.http.get(`${this.apiUrl}/status/${id}`);
  }

  getAllServices() {
    return this.http.get(`${this.apiUrl}/frontend`);

  }
}
