import { Component, OnInit } from '@angular/core';
import { ProductImageService } from '../../../../services/productImages/product-image.service';
import { AlertService } from '../../../../services/alert/alert.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component/pagination.component';
import { ChangeDetectorRef } from '@angular/core';
import { PermissionAuthService } from '../../../../core/services/permission-auth';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-product-images',
  standalone: true,
  imports: [FormsModule, CommonModule, CommonModule, PaginationComponent],
  templateUrl: './product-images.component.html'
})
export class ProductImagesComponent implements OnInit {
  params = {
    pageNumber: 1,
    pageSize: 10,
    search: '',
    sortColumn: '',
    sortDirection: ''
  };

  imageBaseUrl = environment.apiUrlImage;
  product_images: any[] = [];
  totalRecords = 0;
  loading = false;
  productId = 0;
  productName = '';
  constructor(
    private productImageService: ProductImageService,
    private alert: AlertService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public permissionAuth: PermissionAuthService,
    private route: ActivatedRoute,

  ) { }




  loadProductImages() {
    this.loading = true;
    this.productImageService.getProductImages(
      this.productId,
      this.params.pageNumber,
      this.params.pageSize,
      this.params.search

    ).subscribe({

      next: (res: any) => {
        this.product_images = res.data;
        if (res.data.length > 0) {
          console.log(res);
          this.productName = res.data[0].productName;

        }
        this.totalRecords = res.totalRecords;
        this.loading = false;
        this.cd.detectChanges();
      },

      error: (err) => {

        console.log(err);

        alert('api error');

        this.loading = false;
      }
    });
  }

  ngOnInit() {



    this.productId =
      Number(this.route.snapshot.paramMap.get('id'));

    console.log(this.productId);

    this.loadProductImages();
  }
  searchTimeout: any;

  onSearch(value: string) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.params.search = value;
      this.params.pageNumber = 1;
      this.loadProductImages();
    }, 400);
  }

  get totalPages() {
    return Math.ceil(this.totalRecords / this.params.pageSize);
  }

  changePage(page: number) {
    this.params.pageNumber = page;
    this.loadProductImages();
  }

  sortColumn = '';
  sortDirection = 'asc';

  sort(col: string) {
    this.sortColumn = col;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.params['sortColumn'] = this.sortColumn;
    this.params['sortDirection'] = this.sortDirection;

    this.loadProductImages();
  }

  goToAdd() {

    this.router.navigate(['/admin/products-images/add', this.productId]);
  }
  productShow() {
    this.router.navigate(['/admin/products']);
  }
  deleteProductImage(id: number) {
    this.alert.confirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.productImageService.deleteProductImage(id).subscribe({
          next: () => {
            this.alert.success('Product image deleted successfully');
            this.loadProductImages();
          },
          error: () => {
            this.alert.error('Delete failed');
          }
        });

      }

    });

  }
}


