import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../../../services/brands/brand.service';
import { AlertService } from '../../../../services/alert/alert.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component/pagination.component';
import { ChangeDetectorRef } from '@angular/core';
import { PermissionAuthService } from '../../../../core/services/permission-auth';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [FormsModule, CommonModule, CommonModule, PaginationComponent],
  templateUrl: './brands.component.html'
})
export class BrandsComponent implements OnInit {

  params = {
    pageNumber: 1,
    pageSize: 10,
    search: '',
    sortColumn: '',
    sortDirection: ''
  };

  imageBaseUrl = environment.apiUrlImage;

  brands: any[] = [];
  totalRecords = 0;
  loading = false;

  constructor(
    private brandService: BrandService,
    private alert: AlertService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public permissionAuth: PermissionAuthService
  ) { }

  loadBrands() {
    this.loading = true;
    this.brandService.getBrands(
      this.params.pageNumber,
      this.params.pageSize,
      this.params.search
    ).subscribe({
      next: (res: any) => {
        this.brands = res.data;
        this.totalRecords = res.totalRecords;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.alert.error('Failed to load Brand');
      }
    });
  }

  ngOnInit() {
    this.loadBrands();
  }

  searchTimeout: any;

  onSearch(value: string) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.params.search = value;
      this.params.pageNumber = 1;
      this.loadBrands();
    }, 400);
  }

  get totalPages() {
    return Math.ceil(this.totalRecords / this.params.pageSize);
  }

  changePage(page: number) {
    this.params.pageNumber = page;
    this.loadBrands();
  }

  sortColumn = '';
  sortDirection = 'asc';

  sort(col: string) {
    this.sortColumn = col;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.params['sortColumn'] = this.sortColumn;
    this.params['sortDirection'] = this.sortDirection;

    this.loadBrands();
  }


  goToAdd() {
    this.router.navigate(['/admin/brands/add']);
  }

  editBrand(id: number) {
    this.router.navigate(['/admin/brands/edit', id]);
  }



  deleteBrand(id: number) {
    this.alert.confirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.brandService.deleteBrand(id).subscribe({
          next: () => {
            this.alert.success('Brand deleted successfully');
            this.loadBrands();
          },
          error: () => {
            this.alert.error('Delete failed');
          }
        });

      }

    });

  }
}
