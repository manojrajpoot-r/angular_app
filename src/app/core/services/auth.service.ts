import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl + '/auth';

  private userSubject = new BehaviorSubject<any>(
    this.getStoredUser()
  );

  getStoredUser() {

    const user = localStorage.getItem('user');

    if (!user || user === 'undefined') {
      return null;
    }

    return JSON.parse(user);
  }
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(data: any) {

    return this.http.post(`${this.apiUrl}/login`, data).pipe(

      tap((res: any) => {

        this.saveToken(res);

        this.userSubject.next(res.data.user);

      })

    );
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

    localStorage.setItem(
      'accessToken',
      res.data.accessToken
    );

    localStorage.setItem(
      'refreshToken',
      res.data.refreshToken
    );

    localStorage.setItem(
      'roles',
      JSON.stringify(res.data.user.roles || [])
    );

    localStorage.setItem(
      'permissions',
      JSON.stringify(res.data.user.permissions || [])
    );

    localStorage.setItem(
      'user',
      JSON.stringify(res.data.user)
    );
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

    this.userSubject.next(null);

    this.router.navigate(['/admin/login']);

  }

  isLoggedIn(): boolean {

    return !!this.getToken();

  }

  getUser() {

    return this.userSubject.value;

  }
}
