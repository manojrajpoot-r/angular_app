import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/products/product.service';
import { AlertService } from '../../../../services/alert/alert.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component/pagination.component';
import { ChangeDetectorRef } from '@angular/core';
import { PermissionAuthService } from '../../../../core/services/permission-auth';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, CommonModule, CommonModule, PaginationComponent],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {


  params = {
    pageNumber: 1,
    pageSize: 10,
    search: '',
    sortColumn: '',
    sortDirection: ''
  };

  imageBaseUrl = environment.apiUrlImage;

  products: any[] = [];
  totalRecords = 0;
  loading = false;

  constructor(
    private productService: ProductService,
    private alert: AlertService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public permissionAuth: PermissionAuthService
  ) { }

  loadProducts() {

    this.loading = true;
    this.productService.getProducts(
      this.params.pageNumber,
      this.params.pageSize,
      this.params.search
    ).subscribe({
      next: (res: any) => {
        this.products = res.data;
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
    this.loadProducts();
  }

  searchTimeout: any;

  onSearch(value: string) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.params.search = value;
      this.params.pageNumber = 1;
      this.loadProducts();
    }, 400);
  }

  get totalPages() {
    return Math.ceil(this.totalRecords / this.params.pageSize);
  }

  changePage(page: number) {
    this.params.pageNumber = page;
    this.loadProducts();
  }

  sortColumn = '';
  sortDirection = 'asc';

  sort(col: string) {
    this.sortColumn = col;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.params['sortColumn'] = this.sortColumn;
    this.params['sortDirection'] = this.sortDirection;

    this.loadProducts();
  }


  goToAdd() {
    this.router.navigate(['/admin/products/add']);
  }

  editProduct(id: number) {
    this.router.navigate(['/admin/products/edit', id]);
  }

  manageImages(id: number) {
    this.router.navigate(['/admin/products-images/', id]);
  }

  deleteProduct(id: number) {
    this.alert.confirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.alert.success('Brand deleted successfully');
            this.loadProducts();
          },
          error: () => {
            this.alert.error('Delete failed');
          }
        });

      }

    });

  }
}

