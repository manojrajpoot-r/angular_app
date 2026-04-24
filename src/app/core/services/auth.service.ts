import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient, private router: Router) { }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  refreshToken() {
    return this.http.post(`${this.apiUrl}/refresh`, {
      refreshToken: this.getRefreshToken()
    });
  }

  logoutApi() {
    return this.http.post(`${this.apiUrl}/logout-all`, {
      refreshToken: this.getRefreshToken()
    });
  }

  saveToken(res: any) {
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  logout() {
    this.logoutApi().subscribe({
      next: () => { },
      error: () => { }
    });

    localStorage.clear();
    this.router.navigate(['/admin/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
