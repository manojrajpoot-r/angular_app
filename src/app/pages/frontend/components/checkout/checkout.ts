import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CartService } from '../../../../services/frontend/cart/cart.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {

  checkoutForm!: FormGroup;

  cartProducts: any[] = [];

  subtotal: number = 0;

  shipping: number = 100;

  total: number = 0;

  imageBaseUrl = environment.apiUrlImage;

  isLoading: boolean = false;

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.initializeForm();

    this.loadCart();

  }

  initializeForm(): void {

    this.checkoutForm = this.fb.group({

      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ]
      ],

      address: [
        '',
        Validators.required
      ],

      city: [
        '',
        Validators.required
      ],

      state: [
        '',
        Validators.required
      ],

      zipCode: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{6}$')
        ]
      ],

      paymentMethod: [
        'cod',
        Validators.required
      ]

    });

  }

  loadCart(): void {

    this.isLoading = true;

    this.cartService.getCart().subscribe({

      next: (res: any) => {

        console.log('Cart Response:', res);

        this.cartProducts = Array.isArray(res)
          ? res
          : [];

        this.calculateTotal();

        this.isLoading = false;

      },

      error: (err) => {

        console.log('Cart Load Error:', err);

        this.cartProducts = [];

        this.calculateTotal();

        this.isLoading = false;

      }

    });

  }

  calculateTotal(): void {

    this.subtotal = 0;

    this.cartProducts.forEach((item: any) => {

      const price =
        item.discountPrice && item.discountPrice > 0
          ? item.discountPrice
          : item.price;

      const quantity = item.quantity || 1;

      this.subtotal += price * quantity;

    });

    this.total = this.subtotal + this.shipping;

  }

  removeItem(productId: number): void {

    this.cartProducts = this.cartProducts.filter(
      x => x.productId !== productId
    );

    localStorage.setItem(
      'cart',
      JSON.stringify(this.cartProducts)
    );

    this.calculateTotal();

  }

  placeOrder(): void {

    if (this.checkoutForm.invalid) {

      this.checkoutForm.markAllAsTouched();

      return;

    }

    if (this.cartProducts.length === 0) {

      alert('Cart is empty');

      return;

    }

    const orderData = {

      billingDetails: this.checkoutForm.value,

      products: this.cartProducts,

      subtotal: this.subtotal,

      shipping: this.shipping,

      total: this.total,

      paymentMethod:
        this.checkoutForm.value.paymentMethod,

      orderDate: new Date()

    };

    console.log('Order Data:', orderData);

    const paymentMethod =
      this.checkoutForm.value.paymentMethod;

    switch (paymentMethod) {

      case 'cod':

        alert('Order Placed Successfully');

        localStorage.removeItem('cart');

        this.router.navigate([
          '/order-success'
        ]);

        break;

      case 'razorpay':

        alert('Redirecting To Razorpay');

        break;

      case 'stripe':

        alert('Redirecting To Stripe');

        break;

      default:

        alert('Invalid Payment Method');

        break;

    }

  }

  get f() {

    return this.checkoutForm.controls;

  }

}