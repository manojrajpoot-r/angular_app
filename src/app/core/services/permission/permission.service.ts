import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PermissionService {

  private apiUrl = environment.apiUrl + '/Permission';

  constructor(private http: HttpClient) { }

  getPermission(pageNumber: number, pageSize: number, search: string) {
    return this.http.get<any>(this.apiUrl, {
      params: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        search: search
      }
    });
  }

  getPermissionById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addPermission(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  updatePermission(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deletePermission(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
