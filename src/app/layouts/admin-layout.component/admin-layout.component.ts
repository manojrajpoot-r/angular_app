import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'
@Component({

  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

  constructor(private authService: AuthService, private router: Router) { }
  isLoggingOut = false;

  logout() {

    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your account!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {

      if (result.isConfirmed) {

        // 👉 Success popup pehle
        Swal.fire({
          icon: 'success',
          title: 'Confirm Logout',
          text: 'Click OK to logout',
          confirmButtonText: 'OK'
        }).then((res) => {

          if (res.isConfirmed) {

            this.isLoggingOut = true;

            // 👉 Ab actual logout hoga
            this.authService.logoutApi().subscribe({
              next: () => {

                localStorage.clear();

                this.router.navigate(['/admin/login']);
                this.isLoggingOut = false;

              },
              error: () => {

                this.isLoggingOut = false;

                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Logout failed, try again'
                });

              }
            });

          }

        });

      }

    });
  }
}
