import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterModule
} from '@angular/router';

import {
  ProductService
} from '../../../../services/products/product.service';

import {
  CategoryService
} from '../../../../services/category/category.service';

import {
  BrandService
} from '../../../../services/brands/brand.service';

import {
  environment
} from '../../../../environments/environment';

@Component({
  selector: 'app-shop',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],

  templateUrl: './shop.html',
  styleUrl: './shop.css'
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

  pageSize: number = 8;

  totalPages: number = 1;

  isLoading: boolean = false;

  imageBaseUrl =
    environment.apiUrlImage;

  constructor(

    private productService:
      ProductService,

    private categoryService:
      CategoryService,

    private brandService:
      BrandService

  ) { }

  ngOnInit(): void {

    this.loadCategories();

    this.loadBrands();

    this.loadProducts();

  }

  loadCategories(): void {

    this.categoryService.getCategorys(1, 100, '')
      .subscribe({

        next: (res: any) => {

          this.categories = res;

        }

      });

  }

  loadBrands(): void {

    this.brandService.getBrands(1, 100, '')
      .subscribe({

        next: (res: any) => {

          this.brands = res.data;

        }

      });

  }

  loadProducts(): void {

    this.isLoading = true;

    const payload = {

      pageNumber:
        this.pageNumber,

      pageSize:
        this.pageSize,

      search:
        this.search,

      categoryIds:
        this.selectedCategories,

      brandIds:
        this.selectedBrands,

      minPrice:
        this.minPrice,

      maxPrice:
        this.maxPrice,

      sortBy:
        this.sortBy

    };

    this.productService.filterProducts(payload)
      .subscribe({

        next: (res: any) => {

          this.products =
            res.data;

          this.totalPages =
            res.totalPages;

          this.isLoading = false;

        },

        error: () => {

          this.isLoading = false;

        }

      });

  }

  onCategoryChange(
    event: any,
    id: number
  ): void {

    if (event.target.checked) {

      this.selectedCategories
        .push(id);

    } else {

      this.selectedCategories =
        this.selectedCategories
          .filter(x => x !== id);

    }

    this.loadProducts();

  }

  onBrandChange(
    event: any,
    id: number
  ): void {

    if (event.target.checked) {

      this.selectedBrands
        .push(id);

    } else {

      this.selectedBrands =
        this.selectedBrands
          .filter(x => x !== id);

    }

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

    if (
      this.pageNumber <
      this.totalPages
    ) {

      this.pageNumber++;

      this.loadProducts();

    }

  }

  previousPage(): void {

    if (
      this.pageNumber > 1
    ) {

      this.pageNumber--;

      this.loadProducts();

    }

  }

}
