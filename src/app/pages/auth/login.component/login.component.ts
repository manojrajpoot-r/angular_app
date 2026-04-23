import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {

  email = '';
  password = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    if (!this.email || !this.password) {
      alert('Email and Password required');
      return;
    }

    this.loading = true;

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {

        if (res.success) {
          this.authService.saveToken(res);

          this.router.navigate(['/admin/dashboard']);
        } else {
          alert(res.message);
        }

        this.loading = false;
      },
      error: () => {
        alert('Login failed');
        this.loading = false;
      }
    });
  }
}
