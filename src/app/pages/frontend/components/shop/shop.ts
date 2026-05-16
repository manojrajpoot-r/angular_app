import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../../services/products/product.service';
import { CategoryService } from '../../../../services/category/category.service';
import { BrandService } from '../../../../services/brands/brand.service';
import { environment } from '../../../../environments/environment';
import { ProductCardComponent } from '../../../../pages/frontend/components/product-card/product-card';
@Component({
  selector: 'app-shop',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProductCardComponent
  ],

  templateUrl: './shop.html',
  styleUrls: ['./shop.css']
})

export class ShopComponent implements OnInit {

  products: any[] = [];
  categories: any[] = [];
  brands: any[] = [];
  selectedCategories: number[] = [];
  selectedBrands: number[] = [];
  search: string = '';
  sortBy: string = '';
  minPrice: number = 0;
  maxPrice: number = 100000;
  pageNumber: number = 1;
  pageSize: number = 9;
  totalPages: number = 1;
  loading = false;
  imageBaseUrl = environment.apiUrlImage;
  selectedFilterName: string = 'All Products';
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService

  ) { }

  ngOnInit(): void {
    this.resetFilters();
    this.loadCategories();
    this.loadBrands();
    this.loadProducts()
  }
  resetFilters(): void {

    this.selectedCategories = [];
    this.selectedBrands = [];
    this.search = '';
    this.sortBy = '';
    this.minPrice = 0;
    this.maxPrice = 100000;
    this.pageNumber = 1;

  }
  resetAllFilters(): void {

    this.selectedCategories = [];

    this.selectedBrands = [];

    this.search = '';

    this.sortBy = '';

    this.minPrice = 0;

    this.maxPrice = 100000;

    this.pageNumber = 1;

    this.selectedFilterName = 'All Products';

    this.loadProducts();

  }
  trackByProduct(index: number, item: any): number {
    return item.id;
  }

  loadCategories(): void {
    this.categoryService.getAllCategories()
      .subscribe({
        next: (res: any) => {
          this.categories = res.data;

        }
      });

  }

  loadBrands(): void {
    this.brandService.getAllBrands()
      .subscribe({
        next: (res: any) => {
          this.brands = res.data;
        }
      });

  }

  loadProducts(): void {
    this.loading = true;

    const payload = {

      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      search: this.search,
      categoryIds: this.selectedCategories,
      brandIds: this.selectedBrands,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      sortBy: this.sortBy

    };

    this.productService.filterProducts(payload)
      .subscribe({
        next: (res: any) => {
          this.products = res.data;
          this.totalPages = res.totalPages;
          this.loading = false;

        },

        error: () => {
          this.loading = false;
        }

      });

  }

  onCategoryChange(event: any, category: any): void {

    if (event.target.checked) {
      this.selectedCategories.push(category.id);
      this.selectedFilterName = category.name;
    } else {
      this.selectedCategories =
        this.selectedCategories.filter(
          x => x !== category.id
        );
    }

    this.loadProducts();

  }

  onBrandChange(event: any, brand: any): void {

    if (event.target.checked) {
      this.selectedBrands.push(brand.id);
      this.selectedFilterName = brand.name;
    }
    else {
      this.selectedBrands =
        this.selectedBrands.filter(
          x => x !== brand.id
        );

      this.selectedFilterName = 'All Products';
    }

    this.pageNumber = 1;
    this.loadProducts();

  }

  onSearch(): void {
    this.pageNumber = 1;
    this.loadProducts();

  }

  onSortChange(): void {
    this.loadProducts();

  }

  applyPriceFilter(): void {
    this.loadProducts();

  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {

      this.pageNumber++;
      this.loadProducts();

    }

  }

  previousPage(): void {

    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadProducts();

    }

  }

}
