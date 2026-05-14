
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../../services/products/product.service';
import { CartService } from '../../../../services/frontend/cart/cart.service';
import { WishlistService } from '../../../../services/frontend/wishlist/wishlist.service';
import { AlertService } from '../../../../services/alert/alert.service';
import { environment } from '../../../../environments/environment';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CommonModule,
    RouterModule
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetailsComponent implements OnInit {

  product: any;

  relatedProducts: any[] = [];

  quantity: number = 1;

  selectedImage: string = '';

  imageBaseUrl = environment.apiUrlImage;

  isLoading: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private alert: AlertService
  ) { }

  ngOnInit(): void {

    const slug = this.route.snapshot.paramMap.get('slug');

    if (slug) {

      this.loadProduct();

    }

  }

  loadProduct(): void {

    const slug =
      this.route.snapshot.paramMap.get('slug');

    if (!slug) return;

    this.productService
      .getProductBySlug(slug)
      .subscribe({

        next: (res: any) => {

          this.product = res;
          this.selectedImage =
            this.imageBaseUrl + '/' + this.product.image;
          console.log('PRODUCT', this.product);

          // RELATED PRODUCTS CALL

          this.loadRelatedProducts(
            this.product.categoryId,
            this.product.id
          );

        }

      });

  }

  loadRelatedProducts(
    categoryId: number,
    productId: number
  ): void {

    this.productService
      .getRelatedProducts(
        categoryId,
        productId
      )
      .subscribe({

        next: (res: any) => {

          this.relatedProducts = res;

          console.log(
            'RELATED PRODUCTS',
            res
          );

        }

      });

  }

  increaseQty(): void {

    this.quantity++;

  }

  decreaseQty(): void {

    if (this.quantity > 1) {

      this.quantity--;

    }

  }

  addToCart(productId: number): void {

    const payload = {
      productId: productId,
      quantity: this.quantity
    };

    this.cartService
      .addToCart(payload)
      .subscribe({

        next: (res: any) => {

          this.alert.success(
            'Added To Cart'
          );

        },

        error: (err: any) => {

          this.alert.error(
            err?.error?.message
          );

        }

      });

  }

  addToWishlist(productId: number): void {

    this.wishlistService
      .addWishlist({ productId })
      .subscribe({

        next: (res: any) => {

          this.alert.success(
            'Added To Wishlist'
          );

        },

        error: (err: any) => {

          this.alert.error(
            err?.error?.message
          );

        }

      });

  }

}

