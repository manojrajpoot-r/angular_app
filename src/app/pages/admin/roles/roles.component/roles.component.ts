import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../../../core/services/roles/role.service';
import { AlertService } from '../../../../services/alert/alert.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component/pagination.component';
import { ChangeDetectorRef } from '@angular/core';
import { PermissionAuthService } from '../../../../core/services/permission-auth';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [FormsModule, CommonModule, CommonModule, PaginationComponent],
  templateUrl: './roles.component.html'
})
export class RoleComponent implements OnInit {

  params = {
    pageNumber: 1,
    pageSize: 10,
    search: '',
    sortColumn: '',
    sortDirection: ''
  };


  roles: any[] = [];
  totalRecords = 0;
  loading = false;

  constructor(
    private roleservice: RoleService,
    private alert: AlertService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public permissionAuth: PermissionAuthService
  ) { }

  loadroles() {
    this.loading = true;
    this.roleservice.getRoles(
      this.params.pageNumber,
      this.params.pageSize,
      this.params.search
    ).subscribe({
      next: (res: any) => {
        this.roles = res.data;
        this.totalRecords = res.totalRecords;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.alert.error('Failed to load roles');
      }
    });
  }

  ngOnInit() {
    this.loadroles();
  }

  searchTimeout: any;

  onSearch(value: string) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.params.search = value;
      this.params.pageNumber = 1;
      this.loadroles();
    }, 400);
  }

  get totalPages() {
    return Math.ceil(this.totalRecords / this.params.pageSize);
  }

  changePage(page: number) {
    this.params.pageNumber = page;
    this.loadroles();
  }

  sortColumn = '';
  sortDirection = 'asc';

  sort(col: string) {
    this.sortColumn = col;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.params['sortColumn'] = this.sortColumn;
    this.params['sortDirection'] = this.sortDirection;

    this.loadroles();
  }


  goToAdd() {
    this.router.navigate(['/admin/roles/add']);
  }

  editRole(id: number) {
    this.router.navigate(['/admin/roles/edit', id]);
  }

  managePermissions(id: number) {
    this.router.navigate(['/admin/roles/permissions', id]);
  }

  deleteRole(id: number) {
    this.alert.confirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.roleservice.deleteRole(id).subscribe({
          next: () => {
            this.alert.success('Role deleted successfully');
            this.loadroles();
          },
          error: () => {
            this.alert.error('Delete failed');
          }
        });

      }

    });

  }
}
