import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { PasswordInputComponent } from '../../../shared/password-input/password-input';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule, PasswordInputComponent]
})
export class LoginComponent {

  email = '';
  password = '';
  loading = false;



  private userSubject = new BehaviorSubject<any>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );
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

        this.loading = false;

        if (res.success) {

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
