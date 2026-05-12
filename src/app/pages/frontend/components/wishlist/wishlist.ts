
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../../../services/frontend/wishlist/wishlist.service';
import { CartService } from '../../../../services/frontend/cart/cart.service';
import { AlertService } from '../../../../services/alert/alert.service';
import { environment } from '../../../../environments/environment';
import { ProductCardComponent } from '../../../../pages/frontend/components/product-card/product-card';
@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent,],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css']
})
export class WishlistComponent implements OnInit {
  @Input() showWishlistRemove: boolean = false;
  wishlistProducts: any[] = [];

  imageBaseUrl = environment.apiUrlImage;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private alert: AlertService
  ) { }

  ngOnInit(): void {

    this.loadWishlist();

  }

  loadWishlist() {

    this.wishlistService.getWishlist(1).subscribe((res: any) => {

      this.wishlistProducts = res;
      console.log(res);

      const ids = res.map(
        (x: any) => x.productId
      );

      this.wishlistService
        .updateWishlistProducts(ids);

      this.wishlistService
        .updateWishlistCount(res.length);

    });

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

          this.alert.error(
            err?.error?.message ||
            'Something went wrong'
          );

        }

      });

  }



}
