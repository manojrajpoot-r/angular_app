
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ProductVarientServiceService } from '../../../../services/product_varient/product-varient';
import { AlertService } from '../../../../services/alert/alert.service';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component/pagination.component';


@Component({
  selector: 'app-product-varient',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent
  ],
  templateUrl: './product-varient.html',
  styleUrl: './product-varient.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductVarientComponent implements OnInit {

  product_variants: any[] = [];
  loading: boolean = false;
  totalRecords: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  search: string = '';

  private searchSubject = new Subject<string>();

  constructor(
    private product_variantservice: ProductVarientServiceService,
    private alertService: AlertService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.loadproduct_variants();

    // SEARCH OPTIMIZATION
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.pageNumber = 1;
        this.loadproduct_variants();
      });
  }

  // LOAD DATA
  loadproduct_variants(): void {

    this.loading = true;

    this.product_variantservice
      .getproductVarients(
        this.pageNumber,
        this.pageSize,
        this.search
      )
      .subscribe({
        next: (response) => {

          this.product_variants = response.data;
          this.totalRecords = response.totalRecords;
          this.loading = false;
          this.cdr.markForCheck();
        },

        error: () => {

          this.loading = false;
          this.alertService.error('Failed to load product_variants');
          this.cdr.markForCheck();
        }
      });
  }

  // SEARCH
  onSearch(event: any): void {

    this.search = event.target.value;

    this.searchSubject.next(this.search);
  }

  // PAGINATION
  onPageChange(page: number): void {

    this.pageNumber = page;

    this.loadproduct_variants();
  }

  addProductVarient(): void {
    this.router.navigate(['admin/product-varients/add']);
  }
  // EDIT
  editProductVarient(id: number): void {

    this.router.navigate(['admin/product-varients/edit', id]);
  }

  // DELETE
  deleteProductVarient(id: number): void {

    this.alertService.confirmDelete()
      .then((result: any) => {

        if (result.isConfirmed) {

          this.product_variantservice
            .deleteProductVarient(id)
            .subscribe({

              next: (response: any) => {

                this.alertService.success(response.message);

                this.loadproduct_variants();
              },

              error: () => {

                this.alertService.error('Delete failed');
              }
            });
        }
      });
  }

  // STATUS CHANGE
  changeStatus(product_variant: any): void {
    this.product_variantservice.statusProductVarient(product_variant.id)
    this.alertService.success('Status updated');
  }

  // TRACKBY PERFORMANCE
  trackById(index: number, item: any): number {

    return item.id;
  }
}
