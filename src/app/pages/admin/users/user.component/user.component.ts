import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user/user.service';
import { AlertService } from '../../../../services/alert/alert.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component/pagination.component';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PermissionAuthService } from '../../../../core/services/permission-auth';
import { AuthService } from '../../../../core/services/auth.service';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, CommonModule, CommonModule, PaginationComponent, RouterLink],
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

  params = {
    pageNumber: 1,
    pageSize: 10,
    search: '',
    sortColumn: '',
    sortDirection: ''
  };


  users: any[] = [];
  totalRecords = 0;
  loading = false;

  constructor(
    private userService: UserService,
    private alert: AlertService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public permissionAuth: PermissionAuthService,
    public authService: AuthService
  ) { }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers(
      this.params.pageNumber,
      this.params.pageSize,
      this.params.search
    ).subscribe({
      next: (res: any) => {
        this.users = res.data;
        this.totalRecords = res.totalRecords;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.alert.error('Failed to load users');
      }
    });
  }

  ngOnInit() {
    this.loadUsers();
  }


  manageUserRole(id: number) {
    this.router.navigate(['/admin/user/role', id]);
  }

  searchTimeout: any;

  onSearch(value: string) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.params.search = value;
      this.params.pageNumber = 1;
      this.loadUsers();
    }, 400);
  }

  get totalPages() {
    return Math.ceil(this.totalRecords / this.params.pageSize);
  }

  changePage(page: number) {
    this.params.pageNumber = page;
    console.log("PAGE:", page); // 🔥 debug
    this.loadUsers();
  }

  sortColumn = '';
  sortDirection = 'asc';

  sort(col: string) {
    this.sortColumn = col;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.params['sortColumn'] = this.sortColumn;
    this.params['sortDirection'] = this.sortDirection;

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
