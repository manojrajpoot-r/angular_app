import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../../../core/services/permission/permission.service';
import { AlertService } from '../../../../services/alert/alert.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component/pagination.component';
import { ChangeDetectorRef } from '@angular/core';
import { PermissionAuthService } from '../../../../core/services/permission-auth';
@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [FormsModule, CommonModule, CommonModule, PaginationComponent],
  templateUrl: './permission.component.html'
})
export class PermissionComponent implements OnInit {

  params = {
    pageNumber: 1,
    pageSize: 10,
    search: '',
    sortColumn: '',
    sortDirection: ''
  };


  permissions: any[] = [];
  totalRecords = 0;
  loading = false;

  constructor(
    private permissionservice: PermissionService,
    private alert: AlertService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public permissionAuth: PermissionAuthService
  ) { }

  loadpermissions() {
    this.loading = true;
    this.permissionservice.getPermission(
      this.params.pageNumber,
      this.params.pageSize,
      this.params.search
    ).subscribe({
      next: (res: any) => {
        this.permissions = res.data;
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
    this.loadpermissions();
  }

  searchTimeout: any;

  onSearch(value: string) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.params.search = value;
      this.params.pageNumber = 1;
      this.loadpermissions();
    }, 400);
  }

  get totalPages() {
    return Math.ceil(this.totalRecords / this.params.pageSize);
  }

  changePage(page: number) {
    this.params.pageNumber = page;
    this.loadpermissions();
  }

  sortColumn = '';
  sortDirection = 'asc';

  sort(col: string) {
    this.sortColumn = col;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.params['sortColumn'] = this.sortColumn;
    this.params['sortDirection'] = this.sortDirection;

    this.loadpermissions();
  }


  goToAdd() {
    this.router.navigate(['/admin/permissions/add']);
  }

  editPermission(id: number) {
    this.router.navigate(['/admin/permissions/edit', id]);
  }

  deletePermission(id: number) {
    this.alert.confirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.permissionservice.deletePermission(id).subscribe({
          next: () => {
            this.alert.success('Permission deleted successfully');
            this.loadpermissions();
          },
          error: () => {
            this.alert.error('Delete failed');
          }
        });

      }

    });

  }
}
