import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../services/frontend/cart/cart.service';
import { WishlistService } from '../../../services/frontend/wishlist/wishlist.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {

  wishlistCount$!: Observable<number>;

  cartCount$!: Observable<number>;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService
  ) { }

  ngOnInit(): void {

    this.wishlistCount$ =
      this.wishlistService.wishlistCount$;

    this.cartCount$ =
      this.cartService.cartCount$;

    this.loadCartCount();

    this.loadWishlistCount();

  }

  loadWishlistCount() {

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

  loadCartCount() {

    this.cartService
      .getCart()
      .subscribe((res: any) => {

        this.cartService
          .updateCartCount(res.length);

      });

  }

}
