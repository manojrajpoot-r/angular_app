import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RoleService {

  private apiUrl = environment.apiUrl + '/Role';

  constructor(private http: HttpClient) { }
  getRoles(pageNumber: number, pageSize: number, search: string) {
    return this.http.get<any>(this.apiUrl, {
      params: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        search: search
      }
    });
  }

  getRoleById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addRole(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  updateRole(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteRole(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
