import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSliderComponent } from '../../../../pages/frontend/components/hero-slider/hero-slider';
import { CategoryCardComponent } from '../../../../pages/frontend/components/category-card/category-card';
import { ProductCardComponent } from '../../../../pages/frontend/components/product-card/product-card';
import { BrandSliderComponent } from '../../../../pages/frontend/components/brand-slider/brand-slider';
import { NewsletterComponent } from '../../../../pages/frontend/components/newsletter/newsletter';
import { CategoryService } from '../../../../services/category/category.service';
import { ProductService } from '../../../../services/products/product.service';
import { BrandService } from '../../../../services/brands/brand.service';
import { ChangeDetectorRef } from '@angular/core';
import { AlertService } from '../../../../services/alert/alert.service';

@Component({
  selector: 'app-home',
  standalone: true,

  imports: [
    CommonModule,
    HeroSliderComponent,
    CategoryCardComponent,
    ProductCardComponent,
    BrandSliderComponent,
    NewsletterComponent
  ],

  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  categories: any[] = [];
  featuredProducts: any[] = [];
  latestProducts: any[] = [];
  brands: any[] = [];
  loading = false;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private brandService: BrandService,
    private cd: ChangeDetectorRef,
    private alert: AlertService
  ) { }

  ngOnInit(): void {

    this.loadCategories();
    this.loadFeaturedProducts();
    this.loadLatestProducts();
    this.loadBrands();
  }

  // Categories
  loadCategories() {

    this.categoryService
      .getAllCategories()
      .subscribe({

        next: (res: any) => {

          this.categories = res.data;
          this.loading = false;
          this.cd.detectChanges();

        },

        error: (err) => {

          this.loading = false;
          this.alert.error(err);

        }

      });

  }

  // Featured Products
  loadFeaturedProducts() {

    this.loading = true;

    this.productService
      .getFeaturedProducts()
      .subscribe({
        next: (res: any) => {

          this.featuredProducts = res.data;
          this.loading = false;
          this.cd.detectChanges();

        },

        error: (err) => {
          this.loading = false;
          this.alert.error(
            err?.error?.message ||
            'Something went wrong'
          );

        }

      });

  }

  // Latest Products
  loadLatestProducts() {
    this.productService.getlatestProducts()
      .subscribe({
        next: (res: any) => {
          this.latestProducts = res.data;
          this.loading = false;
          this.cd.detectChanges();

        },

        error: (err) => {
          this.loading = false;
          this.alert.error(err)
        }

      });
  }

  // Brands
  loadBrands() {

    this.brandService
      .getAllBrands()
      .subscribe({

        next: (res: any) => {

          this.brands = res.data;
          this.loading = false;
          this.cd.detectChanges();

        },

        error: (err) => {

          this.loading = false;
          this.alert.error(err);

        }

      });

  }

}
