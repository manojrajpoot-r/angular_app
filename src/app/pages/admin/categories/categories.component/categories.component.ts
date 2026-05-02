
import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../../services/category/category.service';
import { AlertService } from '../../../../services/alert/alert.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component/pagination.component';
import { ChangeDetectorRef } from '@angular/core';
import { PermissionAuthService } from '../../../../core/services/permission-auth';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule, CommonModule, CommonModule, PaginationComponent],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {

  params = {
    pageNumber: 1,
    pageSize: 10,
    search: '',
    sortColumn: '',
    sortDirection: ''
  };


  categories: any[] = [];
  totalRecords = 0;
  loading = false;

  constructor(
    private categoryService: CategoryService,
    private alert: AlertService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public permissionAuth: PermissionAuthService
  ) { }

  loadCategories() {
    this.loading = true;
    this.categoryService.getCategorys(
      this.params.pageNumber,
      this.params.pageSize,
      this.params.search
    ).subscribe({
      next: (res: any) => {
        this.categories = res;
        this.totalRecords = res.totalRecords;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.alert.error('Failed to load SubCategorys');
      }
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  searchTimeout: any;

  onSearch(value: string) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.params.search = value;
      this.params.pageNumber = 1;
      this.loadCategories();
    }, 400);
  }

  get totalPages() {
    return Math.ceil(this.totalRecords / this.params.pageSize);
  }

  changePage(page: number) {
    this.params.pageNumber = page;
    this.loadCategories();
  }

  sortColumn = '';
  sortDirection = 'asc';

  sort(col: string) {
    this.sortColumn = col;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.params['sortColumn'] = this.sortColumn;
    this.params['sortDirection'] = this.sortDirection;

    this.loadCategories();
  }


  goToAdd() {
    this.router.navigate(['/admin/categories/add']);
  }

  editCategory(id: number) {
    this.router.navigate(['/admin/categories/edit', id]);
  }



  deleteCategory(id: number) {
    this.alert.confirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id).subscribe({
          next: () => {
            this.alert.success('Category deleted successfully');
            this.loadCategories();
          },
          error: () => {
            this.alert.error('Delete failed');
          }
        });

      }

    });

  }
}
