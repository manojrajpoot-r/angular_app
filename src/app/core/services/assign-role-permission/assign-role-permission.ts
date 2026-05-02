import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AssignRolePermissionService {

  private apiUrl = environment.apiUrl + '/AssignRolePermission';


  constructor(private http: HttpClient) { }

  assignPermission(data: any) {

    return this.http.post(`${this.apiUrl}/assign-permission`, data);

  }

  getRolePermissions(roleId: number) {

    return this.http.get(`${this.apiUrl}/role-permissions/${roleId}`);

  }

}
