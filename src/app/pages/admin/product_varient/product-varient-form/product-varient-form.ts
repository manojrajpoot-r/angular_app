
import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductVarientServiceService } from '../../../../services/product_varient/product-varient';
import { AlertService } from '../../../../services/alert/alert.service';
import { ValidationErrorComponent } from '../../../../shared/components/validators/validation-error-component/validation-error-component';
import { SubmitButtonComponent } from '../../../../shared/components/submit-button-component/submit-button-component';
import { FormWrapperComponent } from '../../../../shared/components/form-wrapper-component/form-wrapper-component';
import { environment } from '../../../../environments/environment';
import { ProductService } from '../../../../services/products/product.service';
import { ColorService } from '../../../../services/colors/color';
import { SizeService } from '../../../../services/sizes/size';
@Component({
  selector: 'app-product-varient-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ValidationErrorComponent,
    SubmitButtonComponent,
    FormWrapperComponent
  ],
  templateUrl: './product-varient-form.html',
  styleUrl: './product-varient-form.css'
})
export class ProductVarientFormComponent implements OnInit {

  productVarientForm!: FormGroup;
  submitted: boolean = false;
  isEditMode: boolean = false;
  productVarientId: number = 0;
  loading: boolean = false;
  isEdit = false;
  products: any[] = [];
  colors: any[] = [];
  sizes: any[] = [];
  constructor(
    private fb: FormBuilder,
    private productVarientService: ProductVarientServiceService,
    private alertService: AlertService,
    public router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private colorService: ColorService,
    private sizeService: SizeService
  ) { }

  ngOnInit(): void {

    this.initializeForm();
    this.getProducts();
    this.getColors();
    this.getSizes();

    this.productVarientId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productVarientId) {
      this.isEditMode = true;
      this.getProductVarientById();
    }


  }

  // FORM
  initializeForm(): void {
    this.productVarientForm = this.fb.group({
      productId: [null, Validators.required],
      colorId: [null, Validators.required],
      sizeId: [null, Validators.required],
      price: [0, Validators.required],
      stock: [0, Validators.required]
    });
  }

  // selectedProduct: any = null;
  getProducts() {
    this.productService.getlatestProducts().subscribe((res: any) => {
      this.products = res.data;
    });
  }

  getColors() {
    this.colorService.getAllColors().subscribe((res: any) => {
      this.colors = res.data;

    });
  }

  getSizes() {
    this.sizeService.getAllSizes().subscribe((res: any) => {
      this.sizes = res.data;

    });
  }





  // GET BY ID
  getProductVarientById(): void {

    this.loading = true;

    this.productVarientService
      .getProductVarientById(this.productVarientId)
      .subscribe({

        next: (response: any) => {

          this.productVarientForm.patchValue({

            productId: response.data.productId,
            colorId: response.data.colorId,
            sizeId: response.data.sizeId,
            price: response.data.price,
            stock: response.data.stock,


          });
          this.loading = false;
        },

        error: () => {
          this.loading = false;
          this.alertService.error('Failed to load product variant');
        }
      });
  }

  // SUBMIT
  onSubmit(): void {

    this.submitted = true;

    if (this.productVarientForm.invalid) {

      this.productVarientForm.markAllAsTouched();

      return;
    }

    this.loading = true;

    const payload = {

      id: this.productVarientId,
      ...this.productVarientForm.value
    };

    // UPDATE
    if (this.isEditMode) {

      this.productVarientService
        .updateProductVarient(this.productVarientId, payload)
        .subscribe({

          next: (response: any) => {

            this.loading = false;

            this.alertService.success(response.message);

            this.router.navigate(['admin/product-varients']);
          },

          error: () => {

            this.loading = false;

            this.alertService.error('Update failed');
          }
        });
    }

    // ADD
    else {

      this.productVarientService
        .addProductVarient(payload)
        .subscribe({

          next: (response: any) => {
            this.loading = false;
            this.alertService.success(response.message);
            this.router.navigate(['admin/product-varients']);
          },

          error: () => {

            this.loading = false;

            this.alertService.error('Add failed');
          }
        });
    }
  }

  // FORM CONTROLS
  get f() {

    return this.productVarientForm.controls;
  }
}
