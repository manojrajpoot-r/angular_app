import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../../services/frontend/cart/cart.service';
import { WishlistService } from '../../../services/frontend/wishlist/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../services/alert/alert.service';
import { SubmitButtonComponent } from '../../../shared/components/submit-button-component/submit-button-component';
import { passwordMatchValidator } from '../../../shared/components/validators/confirm-password.validator';
import * as bootstrap from 'bootstrap';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SubmitButtonComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  user$!: Observable<any>;
  registerForm!: FormGroup;
  loginForm!: FormGroup;
  wishlistCount$!: Observable<number>;
  cartCount$!: Observable<number>;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;
  user: any = {};

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {

    this.user$ =
      this.authService.user$;

    this.initializeForms();

    this.wishlistCount$ =
      this.wishlistService.wishlistCount$;

    this.cartCount$ =
      this.cartService.cartCount$;

    this.loadCartCount();

    this.loadWishlistCount();

    this.isLoggedIn =
      this.authService.isLoggedIn();

    this.authService.user$
      .subscribe(user => {

        this.isLoggedIn = !!user;

      });

  }

  logout() {

    this.authService.logout();

  }
  initializeForms(): void {

    // REGISTER FORM

    this.registerForm = this.fb.group({

      name: [
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

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      confirmPassword: [
        '',
        Validators.required
      ],

      rememberMe: [false],

    },
      {
        validators:
          passwordMatchValidator
      });






    // LOGIN FORM

    this.loginForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      rememberMe: [false]

    });

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

        this.cartService.updateCartCount(res.length);

      });

  }

  // REGISTER

  onSubmit(): void {

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;

    }

    this.loading = true;

    this.authService.register(this.registerForm.value)
      .subscribe({

        next: () => {

          this.loading = false;

          this.alertService
            .success('Registration Successful');

          this.registerForm.reset();
          const modal =
            document.getElementById(
              'registerModal'
            );

          if (modal) {

            const modalInstance =
              bootstrap.Modal.getInstance(modal);

            modalInstance?.hide();

          }


        },

        error: (err) => {

          this.loading = false;

          this.alertService
            .error(
              err?.error?.message ||
              'Registration Failed'
            );

        }
      });
  }

  // LOGIN

  onLogin(): void {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;

    }

    this.loading = true;

    this.authService
      .login(this.loginForm.value)
      .subscribe({

        next: (res: any) => {

          this.loading = false;

          // Remember Me

          if (
            this.loginForm.value.rememberMe
          ) {

            this.authService
              .rememberMe(
                this.loginForm.value.email
              );

          }

          this.alertService
            .success('Login Success');

          this.loginForm.reset();
          const modal =
            document.getElementById(
              'loginModal'
            );

          if (modal) {

            const modalInstance =
              bootstrap.Modal.getInstance(modal);

            modalInstance?.hide();

          }

        },

        error: (err) => {

          this.loading = false;

          this.alertService
            .error(
              err?.error?.message ||
              'Login Failed'
            );

        }

      });

  }

  get f() {

    return this.registerForm.controls;

  }
  get l() {

    return this.loginForm.controls;

  }

}
