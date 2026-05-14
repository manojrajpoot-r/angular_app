import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../../services/frontend/cart/cart.service';
import { environment } from '../../../../environments/environment';
declare var Razorpay: any;
import { PaymentService } from '../../../../services/frontend/payment/payment.service';
import { AlertService } from '../../../../services/alert/alert.service';
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
    private router: Router,
    private paymentService: PaymentService,
    private alert: AlertService
  ) { }

  async ngOnInit(): Promise<void> {

    await this.loadRazorpayScript();

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


  loadRazorpayScript(): Promise<boolean> {

    return new Promise((resolve) => {

      // already loaded

      if (document.getElementById('razorpay-script')) {

        resolve(true);

        return;

      }

      const script = document.createElement('script');

      script.id = 'razorpay-script';

      script.src =
        'https://checkout.razorpay.com/v1/checkout.js';

      script.onload = () => {

        console.log('Razorpay Loaded');

        resolve(true);

      };

      script.onerror = () => {

        console.log('Razorpay Failed To Load');

        resolve(false);

      };

      document.body.appendChild(script);

    });

  }




  ngOnDestroy(): void {

    const script =
      document.getElementById('razorpay-script');

    if (script) {

      script.remove();

    }

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

      fullName:
        this.checkoutForm.value.fullName,

      email:
        this.checkoutForm.value.email,

      phone:
        this.checkoutForm.value.phone,

      address:
        this.checkoutForm.value.address,

      city:
        this.checkoutForm.value.city,

      state:
        this.checkoutForm.value.state,

      zipCode:
        this.checkoutForm.value.zipCode,

      paymentMethod:
        this.checkoutForm.value.paymentMethod

    };

    console.log('Order Data:', orderData);

    const paymentMethod =
      this.checkoutForm.value.paymentMethod;

    switch (paymentMethod) {

      case 'cod':

        this.paymentService
          .checkout(orderData)
          .subscribe({

            next: (res: any) => {

              this.alert.success(
                'Order Placed Successfully'
              );

              localStorage.removeItem('cart');

              this.router.navigate([
                '/order-success'
              ]);

            },

            error: (err: any) => {

              console.log(err);

              this.alert.error(
                'Order Failed'
              );

            }

          });

        break;

      case 'razorpay':
        this.payWithRazorpay(orderData);

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


  payWithRazorpay(orderData: any): void {

    this.isLoading = true;

    // STEP 1
    // Create Local Order

    this.paymentService.checkout(orderData)
      .subscribe({

        next: (orderRes: any) => {

          console.log('Checkout Response', orderRes);

          // STEP 2
          // Create Razorpay Order

          this.paymentService
            .createOrder(this.total)
            .subscribe({

              next: (res: any) => {

                console.log('Razorpay Order', res);
                const options = {

                  key: res.key,

                  amount: res.amount,

                  currency: res.currency,

                  name: 'My Company',

                  description: 'Order Payment',

                  order_id: res.orderId,

                  prefill: {

                    name: this.checkoutForm.value.fullName,

                    email: this.checkoutForm.value.email,

                    contact: this.checkoutForm.value.phone

                  },

                  theme: {
                    color: '#000000'
                  },

                  handler: (response: any) => {

                    console.log(response);

                    const verifyData = {

                      orderId: orderRes.orderId,

                      razorpayOrderId:
                        response.razorpay_order_id,

                      razorpayPaymentId:
                        response.razorpay_payment_id,

                      razorpaySignature:
                        response.razorpay_signature

                    };

                    this.paymentService
                      .verifyPayment(verifyData)
                      .subscribe({

                        next: (verifyRes: any) => {

                          console.log(
                            'VERIFY SUCCESS',
                            verifyRes
                          );

                          this.isLoading = false;

                          this.alert.success(
                            'Payment Success'
                          );

                          localStorage.removeItem('cart');

                          this.router.navigate([
                            '/order-success'
                          ]);

                        },

                        error: (err: any) => {

                          console.log(
                            'VERIFY ERROR',
                            err
                          );

                          this.isLoading = false;

                          this.alert.error(
                            'Verification Failed'
                          );

                        }

                      });

                  }

                };

                const razorpay = new Razorpay(options);

                // PAYMENT FAILED EVENT

                razorpay.on(
                  'payment.failed',
                  (response: any) => {

                    console.log(
                      'Payment Failed',
                      response
                    );

                    // DATABASE UPDATE
                    this.paymentService
                      .paymentFailed(orderRes.orderId)
                      .subscribe({

                        next: (res: any) => {

                          console.log(
                            'FAILED STATUS UPDATED',
                            res
                          );

                        },

                        error: (err: any) => {

                          console.log(
                            'FAILED UPDATE ERROR',
                            err
                          );

                        }

                      });

                    this.isLoading = false;

                    this.alert.error(
                      "Payment Failed"
                    );

                    this.router.navigate([
                      '/payment-failed'
                    ]);

                  }
                );

                razorpay.open();

              },

              error: (err: any) => {

                console.log(
                  'Create Order Error',
                  err
                );

                this.isLoading = false;
                this.alert.error("Unable To Create Razorpay Order");
              }

            });

        },

        error: (err: any) => {

          console.log('Checkout Error', err);

          this.isLoading = false;
          this.alert.error("Checkout Failed");
        }

      });

  }

}
