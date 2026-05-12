import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../../services/frontend/cart/cart.service';
import { AlertService } from '../../../../services/alert/alert.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {

  cartProducts: any[] = [];
  subtotal: number = 0;
  imageBaseUrl = environment.apiUrlImage;

  constructor(
    private cartService: CartService,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService
      .getCart()
      .subscribe((res: any) => {
        this.cartProducts = res;
        this.calculateTotal();
        this.cartService.updateCartCount(res.length);

      });

  }

  calculateTotal() {
    this.subtotal = 0;
    this.cartProducts.forEach((item: any) => {
      this.subtotal += item.discountPrice * item.quantity;
    });

  }


  increaseQty(product: any) {

    this.cartService
      .increaseQuantity(product.id)
      .subscribe({

        next: (res: any) => {

          this.loadCart();
          this.calculateTotal();
        },

        error: (err) => {

          this.alert.error(
            err?.error?.message ||
            'Something went wrong'
          );

        }

      });

  }

  decreaseQty(product: any) {

    this.cartService
      .decreaseQuantity(product.id)
      .subscribe({

        next: (res: any) => {

          this.loadCart();
          this.calculateTotal();

        },

        error: (err) => {

          this.alert.error(
            err?.error?.message ||
            'Something went wrong'
          );

        }

      });

  }



  removeCart(cartId: number) {
    this.cartService
      .removeCart(cartId)
      .subscribe({
        next: (res: any) => {
          this.alert.success(res.message);
          this.loadCart();
        },

        error: (err) => {
          this.alert.error(err?.error?.message || 'Something went wrong');
        }

      });

  }
}
