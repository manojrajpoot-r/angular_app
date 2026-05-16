import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { PasswordInputComponent } from '../../../shared/password-input/password-input';
import { AlertService } from '../../../services/alert/alert.service';
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
  constructor(private authService: AuthService, private router: Router, private alertService: AlertService) { }


  login() {

    if (!this.email || !this.password) {

      this.alertService.error(
        'Email and Password required'
      );

      return;
    }

    this.loading = true;

    this.authService.login({

      email: this.email,
      password: this.password

    }).subscribe({

      next: (res: any) => {

        this.loading = false;

        this.alertService.success(
          'Login Successful'
        );

        // ROLE CHECK

        const role =
          localStorage.getItem('role');

        this.router.navigate([
          '/admin/dashboard'
        ]);
      },

      error: (err) => {

        this.loading = false;

        this.alertService.error(

          err?.error?.message ||

          'Login Failed'

        );

      }

    });

  }
}
