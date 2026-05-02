import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AssignUserRoleService {

  private apiUrl = environment.apiUrl + '/AssignUserRole';


  constructor(private http: HttpClient) { }

  assignUserRole(data: any) {

    return this.http.post(`${this.apiUrl}/assign-role`, data);

  }

  getUserRoles(userId: number) {

    return this.http.get(`${this.apiUrl}/user-roles/${userId}`);

  }

}

