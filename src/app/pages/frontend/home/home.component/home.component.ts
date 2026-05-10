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
  ) {}

  ngOnInit(): void {

    this.loadCategories();

    this.loadFeaturedProducts();

    this.loadLatestProducts();

    this.loadBrands();
  }

  // Categories
loadCategories() {

  this.categoryService.getCategorys(1,10,'')
    .subscribe({

      next: (res: any) => {

        this.categories = res;
        console.log(res);
        this.loading = false;
        this.cd.detectChanges();
      },

      error: (err) => {

        console.log(err);
         this.loading = false;
      }

    });
}

  // Featured Products
loadFeaturedProducts() {

  this.productService.getFeaturedProducts()
    .subscribe({

      next: (res: any) => {
        this.loading = false;
        this.cd.detectChanges();
        console.log('featured', res);

        this.featuredProducts = res.data;
      },

      error: (err) => {
      this.loading = false;
        console.log(err);
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
        console.log(err);
      }

    });
}

  // Brands
  loadBrands() {

    this.brandService.getBrands(1,100,'')
      .subscribe({

        next: (res: any) => {

          this.brands = res.data;
           this.loading = false;
        this.cd.detectChanges();
        },

        error: (err) => {
          this.loading = false;
          console.log(err);
        }

      });
  }

}