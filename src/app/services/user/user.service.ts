import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {

  private apiUrl = environment.apiUrl + '/User';

  constructor(private http: HttpClient) { }

  getUsers(page: number, search: string) {
    return this.http.get(`${this.apiUrl}?page=${page}&search=${search}`);
  }

  getUserById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addUser(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  updateUser(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
