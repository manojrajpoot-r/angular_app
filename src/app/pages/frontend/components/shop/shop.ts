import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../../services/products/product.service';
import { CategoryService } from '../../../../services/category/category.service';
import { BrandService } from '../../../../services/brands/brand.service';
import { environment } from '../../../../environments/environment';
import { ProductCardComponent } from '../../../../pages/frontend/components/product-card/product-card';
import { BehaviorSubject, debounceTime, switchMap, Subject, takeUntil } from 'rxjs';
import { RouterLink, ActivatedRoute } from '@angular/router';

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
  selectedSubCategories: number[] = [];
  selectedCategoryName: string = '';
  selectedSubCategoryName: string = '';


  private filterSubject = new BehaviorSubject<any>(null);
  private destroy$ = new Subject<void>();
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.resetAllFilters();
    this.loadCategories();
    this.loadBrands();
    this.handleFilters();

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

    this.filterSubject.next(true);

  }
  trackByProduct(index: number, item: any): number {
    return item.id;
  }

  loadCategories(): void {

    this.categoryService
      .getAllCategories()
      .subscribe({

        next: (res: any) => {

          this.categories = res.data;

          // IMPORTANT
          this.handleQueryParams();

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




  handleFilters(): void {

    this.filterSubject

      .pipe(

        debounceTime(300),
        takeUntil(this.destroy$),
        switchMap(() => {

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



          return this.productService
            .filterProducts(payload);

        })

      )

      .subscribe({

        next: (res: any) => {



          this.products = res.data;

          this.totalPages = res.totalPages;

          this.loading = false;

        },

        error: (err) => {

          console.log(err);

          this.loading = false;

        }

      });

  }


  handleQueryParams(): void {

    this.route.queryParams.subscribe(params => {

      const categoryId = +params['categoryId'];

      const subCategoryId = +params['subCategoryId'];

      // CATEGORY
      if (categoryId) {

        this.selectedCategories = [categoryId];

        const category = this.categories.find(
          x => x.id === categoryId
        );

        if (category) {

          this.selectedCategoryName = category.name;

        }

      }

      // SUB CATEGORY
      if (subCategoryId) {

        this.selectedSubCategories = [subCategoryId];

        this.categories.forEach(category => {

          const sub = category.subCategories?.find(
            (x: any) => x.id === subCategoryId
          );

          if (sub) {

            this.selectedSubCategoryName = sub.name;

          }

        });

      }

      // FINAL API CALL
      this.filterSubject.next(true);

    });

  }


  onCategoryChange(event: any, category: any): void {

    if (event.target.checked) {

      this.selectedCategories = [
        ...this.selectedCategories,
        category.id
      ];

    } else {

      this.selectedCategories =
        this.selectedCategories.filter(
          x => x !== category.id
        );

    }
    console.log("event.target.checked", event.target.checked)
    // FILTER NAME

    if (this.selectedCategories.length === 1) {

      this.selectedFilterName = category.name;

    }

    else if (this.selectedCategories.length > 1) {

      this.selectedFilterName =
        `${this.selectedCategories.length} Categories Selected`;

    }

    else {

      this.selectedFilterName = 'All Products';

    }

    this.pageNumber = 1;

    this.filterSubject.next(true);

  }

  onBrandChange(event: any, brand: any): void {

    if (event.target.checked) {

      this.selectedBrands = [
        ...this.selectedBrands,
        brand.id
      ];

      this.selectedFilterName = brand.name;

    } else {

      this.selectedBrands =
        this.selectedBrands.filter(
          x => x !== brand.id
        );
    }

    if (this.selectedBrands.length === 1) {

      this.selectedFilterName = brand.name;

    }

    else if (this.selectedBrands.length > 1) {

      this.selectedFilterName =
        `${this.selectedBrands.length} Brands Selected`;

    }

    else {

      this.selectedFilterName = 'All Products';

    }



    this.pageNumber = 1;

    this.filterSubject.next(true);

  }

  onSearch(): void {
    this.pageNumber = 1;
    this.filterSubject.next(true);

  }

  onSortChange(): void {
    this.filterSubject.next(true);

  }

  applyPriceFilter(): void {
    this.filterSubject.next(true);

  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {

      this.pageNumber++;
      this.filterSubject.next(true);

    }

  }

  previousPage(): void {

    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.filterSubject.next(true);

    }

  }

}
