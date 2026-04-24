import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';
import { AlertService } from '../../../../services/alert/alert.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

  users: any[] = [];
  page = 1;
  totalPages = 1;
  search = '';
  loading = false;

  constructor(
    private userService: UserService,
    private alert: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;

    this.userService.getUsers(this.page, this.search).subscribe({
      next: (res: any) => {
        this.users = res.data || res;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alert.error('Failed to load users');
      }
    });
  }

  onSearch() {
    this.page = 1;
    this.loadUsers();
  }

  changePage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.loadUsers();
  }


  goToAdd() {
    this.router.navigate(['/admin/users/add']);
  }

  editUser(id: number) {
    this.router.navigate(['/admin/users/edit', id]);
  }

  deleteUser(id: number) {

    this.alert.confirmDelete().then((result) => {

      if (result.isConfirmed) {

        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.alert.success('User deleted successfully');
            this.loadUsers();
          },
          error: () => {
            this.alert.error('Delete failed');
          }
        });

      }

    });

  }
}
