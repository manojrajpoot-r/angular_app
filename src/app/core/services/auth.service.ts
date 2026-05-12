// ============================================
// auth.service.ts
// ============================================

import { Injectable } from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';

import {
  BehaviorSubject,
  timer
} from 'rxjs';

import {
  tap
} from 'rxjs/operators';

import { Router } from '@angular/router';

import { environment }
from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl + '/auth';
  autoLogoutTimer?: ReturnType<typeof setTimeout>;
  // OBSERVABLE
  private userSubject =
    new BehaviorSubject<any>(
      this.getStoredUser()
    );

    user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

    // ============================================
  // GET USER
  // ============================================

  getUser() {

    return this.userSubject.value;

  }

  // ============================================
  // REGISTER
  // ============================================

  register(data: any) {

    return this.http.post(
      `${this.apiUrl}/register`,
      data
    );

  }

  // ============================================
  // LOGIN
  // ============================================

  login(data: any) {

    return this.http.post(
      `${this.apiUrl}/login`,
      data
    ).pipe(

      tap((res: any) => {

        this.saveToken(res);

        this.userSubject.next(
          res.data.user
        );

        this.autoLogout(
          60 * 60 * 1000
        );

      })

    );

  }

  // ============================================
  // GOOGLE LOGIN
  // ============================================

  googleLogin() {

    window.location.href =
      `${this.apiUrl}/google-login`;

  }

  // ============================================
  // REFRESH TOKEN
  // ============================================

  refreshToken() {

    return this.http.post(
      `${this.apiUrl}/refresh`,
      {
        refreshToken:
          this.getRefreshToken()
      }
    );

  }

  // ============================================
  // FORGOT PASSWORD
  // ============================================

  forgotPassword(email: string) {

    return this.http.post(
      `${this.apiUrl}/forgot-password`,
      { email }
    );

  }

  // ============================================
  // RESET PASSWORD
  // ============================================

  resetPassword(data: any) {

    return this.http.post(
      `${this.apiUrl}/reset-password`,
      data
    );

  }

  // ============================================
  // EMAIL VERIFICATION
  // ============================================

  verifyEmail(token: string) {

    return this.http.get(
      `${this.apiUrl}/verify-email/${token}`
    );

  }

  // ============================================
  // OTP VERIFY
  // ============================================

  verifyOtp(data: any) {

    return this.http.post(
      `${this.apiUrl}/verify-otp`,
      data
    );

  }

  // ============================================
  // RESEND OTP
  // ============================================

  resendOtp(email: string) {

    return this.http.post(
      `${this.apiUrl}/resend-otp`,
      { email }
    );

  }

  // ============================================
  // SAVE TOKEN
  // ============================================

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
    'user',
    JSON.stringify(
      res.data.user
    )
  );

  // IMPORTANT

  this.userSubject.next(
    res.data.user
  );

}

  // ============================================
  // GET TOKEN
  // ============================================

  getToken() {

    return localStorage.getItem(
      'accessToken'
    );

  }

  // ============================================
  // REFRESH TOKEN
  // ============================================

  getRefreshToken() {

    return localStorage.getItem(
      'refreshToken'
    );

  }

  // ============================================
  // REMEMBER ME
  // ============================================

  rememberMe(email: string) {

    localStorage.setItem(
      'rememberEmail',
      email
    );

  }

  getRememberedEmail() {

    return localStorage.getItem(
      'rememberEmail'
    );

  }

  // ============================================
  // AUTO LOGOUT
  // ============================================

  autoLogout(expirationDuration: number) {

    this.autoLogoutTimer =
      setTimeout(() => {

        this.logout();

      }, expirationDuration);

  }

  // ============================================
  // LOGOUT
  // ============================================

logout() {

  this.logoutApi().subscribe({
    next: () => {},
    error: () => {}
  });

  localStorage.clear();

  this.userSubject.next(null);

  this.router.navigate([
    '/'
  ]);

}
  logoutApi() {

    return this.http.post(
      `${this.apiUrl}/logout`,
      {}
    );

  }
  // ============================================
  // LOGIN CHECK
  // ============================================

  isLoggedIn(): boolean {

    return !!this.getToken();

  }

  // ============================================
  // STORED USER
  // ============================================

  getStoredUser() {

    const user =
      localStorage.getItem('user');

    return user
      ? JSON.parse(user)
      : null;

  }

}