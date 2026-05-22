import { Component, Input, OnInit, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../../services/frontend/cart/cart.service';
import { WishlistService } from '../../../../services/frontend/wishlist/wishlist.service';
import { PermissionAuthService } from '../../../../core/services/permission-auth';
import { AlertService } from '../../../../services/alert/alert.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { HeaderComponent } from '../../../../layouts/frontend/header.component/header.component';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCardComponent implements OnInit, OnChanges {
  @Input() showWishlistRemove: boolean = false;
  @Input() product: any;
  imageBaseUrl = environment.apiUrlImage;
  isWishlist: boolean = false;

  @Output() wishlistRemoved = new EventEmitter<void>();

  constructor(
    private route: ActivatedRoute,
    private alert: AlertService,
    private router: Router,
    public permissionAuth: PermissionAuthService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) { }

  ngOnInit(): void {
    this.wishlistService
      .wishlistProducts$
      .subscribe((ids: number[]) => {
        this.isWishlist =
          ids.includes(
            this.product.productId || this.product.id
          );
      });
    const slug = this.route.snapshot.paramMap.get('slug');
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(
    //   'PRODUCT CHANGED',
    //   this.product
    // );

  }
  addToCart(productId: number) {
    const payload = {
      productId: productId,
      quantity: 1
    };

    this.cartService
      .addToCart(payload)
      .subscribe({
        next: (res: any) => {
          this.alert.success('Added To Cart Successfully');
          this.cartService
            .getCart()
            .subscribe((cart: any) => {

              this.cartService
                .updateCartCount(cart.length);

            });

        },

        error: (err) => {
          const message =
            err?.status === 401
              ? 'You need to login first to add items to your cart'
              : err?.error?.message || 'Unable to add product to cart';

          this.alert.error(message);
        }
      });

  }

  addToWishlist(productId: number) {

    const data = {
      productId: productId,
    };

    this.wishlistService
      .addWishlist(data)
      .subscribe({
        next: (res: any) => {
          this.alert.success(res.message);
          this.loadWishlistProducts();
        },
        error: (err) => {
          let message = 'Failed to update wishlist. Please try again.';
          if (err.status === 401) {
            message = 'Please login to add items to your wishlist';
          }
          this.alert.error(message);
        }
      });

  }

  loadWishlistProducts() {

    this.wishlistService
      .getWishlist(1)
      .subscribe((res: any) => {
        const ids = res.map(
          (x: any) => x.productId
        );
        this.wishlistService
          .updateWishlistProducts(ids);

        this.wishlistService
          .updateWishlistCount(res.length);

      });

  }

  removeWishlist(productId: number) {
    this.wishlistService
      .removeWishlist(productId)
      .subscribe({
        next: (res: any) => {
          this.alert.success(res.message);
          this.loadWishlistProducts();
          this.wishlistRemoved.emit();
        },
        error: (err) => {
          this.alert.error(
            err?.error?.message ||
            'Something went wrong'
          );
        }
      });

  }
}
