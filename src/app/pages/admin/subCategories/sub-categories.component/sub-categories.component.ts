import { Component, OnInit } from '@angular/core';
import { SubCategoryService } from '../../../../services/subCategory/sub-category.service';
import { AlertService } from '../../../../services/alert/alert.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component/pagination.component';
import { ChangeDetectorRef } from '@angular/core';
import { PermissionAuthService } from '../../../../core/services/permission-auth';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-sub-categories',
  standalone: true,
  imports: [FormsModule, CommonModule, CommonModule, PaginationComponent],
  templateUrl: './sub-categories.component.html'
})
export class SubCategoriesComponent implements OnInit {

  params = {
    pageNumber: 1,
    pageSize: 10,
    search: '',
    sortColumn: '',
    sortDirection: ''
  };

  imageBaseUrl = environment.apiUrlImage;

  subCategories: any[] = [];
  totalRecords = 0;
  loading = false;

  constructor(
    private subCategoryService: SubCategoryService,
    private alert: AlertService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public permissionAuth: PermissionAuthService
  ) { }

  loadSubCategorys() {
    this.loading = true;
    this.subCategoryService.getSubCategorys(
      this.params.pageNumber,
      this.params.pageSize,
      this.params.search
    ).subscribe({
      next: (res: any) => {
        this.subCategories = res;
        console.log(this.subCategories);
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
    this.loadSubCategorys();
  }

  searchTimeout: any;

  onSearch(value: string) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.params.search = value;
      this.params.pageNumber = 1;
      this.loadSubCategorys();
    }, 400);
  }

  get totalPages() {
    return Math.ceil(this.totalRecords / this.params.pageSize);
  }

  changePage(page: number) {
    this.params.pageNumber = page;
    this.loadSubCategorys();
  }

  sortColumn = '';
  sortDirection = 'asc';

  sort(col: string) {
    this.sortColumn = col;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.params['sortColumn'] = this.sortColumn;
    this.params['sortDirection'] = this.sortDirection;

    this.loadSubCategorys();
  }


  goToAdd() {
    this.router.navigate(['/admin/subCategories/add']);
  }

  editSubCategory(id: number) {
    this.router.navigate(['/admin/subCategories/edit', id]);
  }



  deleteSubCategory(id: number) {
    this.alert.confirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.subCategoryService.deleteSubCategory(id).subscribe({
          next: () => {
            this.alert.success('SubCategory deleted successfully');
            this.loadSubCategorys();
          },
          error: () => {
            this.alert.error('Delete failed');
          }
        });

      }

    });

  }
}
