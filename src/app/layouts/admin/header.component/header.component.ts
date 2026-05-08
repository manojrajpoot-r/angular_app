import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private authService: AuthService, private router: Router) { }
  user: any;
  isLoggingOut = false;


  ngOnInit() {

    this.authService.user$.subscribe((res) => {
      this.user = res;
    });

  }


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
            this.authService.logout();
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
