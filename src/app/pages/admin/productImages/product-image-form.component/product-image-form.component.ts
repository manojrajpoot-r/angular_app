
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductImageService } from '../../../../services/productImages/product-image.service';
import { AlertService } from '../../../../services/alert/alert.service';
import { ImageUploadComponent } from '../../../../shared/components/image-upload/image-upload';
import { ValidationErrorComponent } from '../../../../shared/components/validators/validation-error-component/validation-error-component';
import { SubmitButtonComponent } from '../../../../shared/components/submit-button-component/submit-button-component';
import { FormWrapperComponent } from '../../../../shared/components/form-wrapper-component/form-wrapper-component';
import { environment } from '../../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-product-image-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ImageUploadComponent,
    ValidationErrorComponent,
    SubmitButtonComponent,
    FormWrapperComponent
  ],
  templateUrl: './product-image-form.component.html'
})
export class ProductImageFormComponent implements OnInit {

  loading = false;
  form!: FormGroup;
  product_images: any[] = [];
  productId = 0;

  selectedFiles: File[] = [];
  isEdit = false;
  id = 0;
  imageUrls: string[] = [];
  constructor(
    private fb: FormBuilder,
    private productImageService: ProductImageService,
    private route: ActivatedRoute,
    public router: Router,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      image: [null, Validators.required],
    });

    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProductImages();

  }


  loadProductImages() {
    this.productImageService.getProductImages(1, 100, 1, '').subscribe((res: any) => {
      this.product_images = res;
    });
  }



  onFileSelected(files: File[]) {

    this.selectedFiles = files;

    this.form.patchValue({
      image: files
    });

    this.form.get('image')?.markAsTouched();
  }

  buildFormData(): FormData {
    const formData = new FormData();
    for (let file of this.selectedFiles) {
      formData.append('Images', file);
    }
    formData.append('ProductId', this.productId.toString());
    return formData;
  }


  saveProductImage() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.buildFormData();
    const request = this.productImageService.addProductImage(formData);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.alert.success('Saved successfully');
        this.router.navigate(['/admin/products-images', this.productId]);
      },
      error: () => {
        this.loading = false;
        this.alert.error('Something went wrong');
      }
    });
  }
}



