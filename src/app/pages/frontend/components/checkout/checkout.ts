import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../../services/frontend/cart/cart.service';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartProducts: any[] = [];
  subtotal: number = 0;
  shipping: number = 100;
  total: number = 0;
  paymentMethod: string = 'cod';
  imageBaseUrl = environment.apiUrlImage;

  billing = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  };
  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCart();
    this.calculateTotal();
    this.checkoutForm =
      this.fb.group({

        fullName: [
          '',
          Validators.required
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
          Validators.required
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
          Validators.required
        ],

        paymentMethod: [
          'cod',
          Validators.required
        ]

      });

    this.loadCart();

  }


  loadCart() {
    this.cartService.getCart().subscribe((res: any) => {
      this.cartProducts = res;
      console.log(res);
      this.calculateTotal();

    });

  }

  calculateTotal() {
    this.subtotal = 0;
    this.cartProducts.forEach((item: any) => {
      this.subtotal += item.discountPrice * item.quantity;
    });

    this.total = this.subtotal + this.shipping;

  }
  placeOrder() {

    if (this.checkoutForm.invalid) {

      this.checkoutForm.markAllAsTouched();

      return;

    }

    const data = {

      billing:
        this.checkoutForm.value,

      products:
        this.cartProducts,

      paymentMethod:
        this.checkoutForm.value.paymentMethod

    };

    console.log(data);

    if (
      this.checkoutForm.value.paymentMethod
      === 'cod'
    ) {

      alert('Order Placed Successfully');

      this.router.navigate([
        '/order-success'
      ]);

    }

    else if (
      this.checkoutForm.value.paymentMethod
      === 'razorpay'
    ) {

      alert('Open Razorpay Payment');

    }

    else if (
      this.checkoutForm.value.paymentMethod
      === 'stripe'
    ) {

      alert('Open Stripe Payment');

    }

  }

}
