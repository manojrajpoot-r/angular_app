import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {

  email = '';
  password = '';
  loading = false;
  showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  constructor(private authService: AuthService, private router: Router) { }


  login() {
    if (!this.email || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Email and Password required'
      });
      return;
    }

    this.loading = true;

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        //console.log("LOGIN RESPONSE =>", res);
        this.loading = false;

        if (res.success) {

          this.authService.saveToken(res);

          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: res.message || 'Welcome back!',
            confirmButtonText: 'Continue'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/admin/dashboard']);
            }
          });

        } else {

          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: res.message
          });
        }
      },

      error: () => {
        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Server Error',
          text: 'Login failed, please try again'
        });
      }
    });
  }
}
