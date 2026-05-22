
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../services/products/product.service';
import { CategoryService } from '../../../../services/category/category.service';
import { SubCategoryService } from '../../../../services/subCategory/sub-category.service';
import { BrandService } from '../../../../services/brands/brand.service';
import { AlertService } from '../../../../services/alert/alert.service';
import { ImageUploadComponent } from '../../../../shared/components/image-upload/image-upload';
import { ValidationErrorComponent } from '../../../../shared/components/validators/validation-error-component/validation-error-component';
import { SubmitButtonComponent } from '../../../../shared/components/submit-button-component/submit-button-component';
import { FormWrapperComponent } from '../../../../shared/components/form-wrapper-component/form-wrapper-component';
import { environment } from '../../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-sub-category-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ImageUploadComponent,
    ValidationErrorComponent,
    SubmitButtonComponent,
    FormWrapperComponent
  ],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {

  loading = false;
  form!: FormGroup;
  products: any[] = [];
  categories: any[] = [];
  subCategories: any[] = [];
  brands: any[] = [];
  selectedFile!: File;

  isEdit = false;
  id = 0;
  imageUrls: string[] = [];
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private brandService: BrandService,
    private route: ActivatedRoute,
    public router: Router,
    private alert: AlertService
  ) { }

  loadCategories() {
    this.categoryService.getCategorys(1, 100, '')
      .subscribe((res: any) => {
        this.categories = res;
      });
  }

  loadSubCategories() {
    this.subCategoryService.getSubCategorys(1, 100, '')
      .subscribe((res: any) => {
        this.subCategories = res;
      });
  }

  loadBrands() {
    this.brandService.getBrands(1, 100, '')
      .subscribe((res: any) => {
        this.brands = res.data;
      });
  }

  ngOnInit() {
    this.form = this.fb.group({
      categoryId: ['', Validators.required],
      subCategoryId: ['', Validators.required],
      brandId: ['', Validators.required],

      name: ['', Validators.required],
      shortDescription: [''],
      description: [''],

      price: [0, Validators.required],
      discountPercentage: [0, Validators.required],
      discountPrice: [0],

      quantity: [0, Validators.required],

      image: [null, Validators.required],

      isFeatured: [false],

    });

    this.loadCategories();
    this.loadSubCategories();
    this.loadBrands();

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProducts();
    if (this.id) {
      this.isEdit = true;
      this.getById();
    }
  }


  calculateDiscountPrice() {
    const price = Number(this.form.value.price);
    const discountPercentage = Number(this.form.value.discountPercentage);
    const discountPrice = price - (price * discountPercentage / 100);

    this.form.patchValue({
      discountPrice: discountPrice
    });
  }


  loadProducts() {
    this.productService.getProducts(1, 100, '').subscribe((res: any) => {
      this.products = res;
    });
  }

  getById() {
    this.productService.getProductById(this.id).subscribe((res: any) => {

      this.form.patchValue({
        categoryId: res.data.categoryId,
        subCategoryId: res.data.subCategoryId,
        brandId: res.data.brandId,
        name: res.data.name,
        shortDescription: res.data.shortDescription,
        description: res.data.description,
        price: res.data.price,
        discountPercentage: res.data.discountPercentage,
        discountPrice: res.data.discountPrice,
        quantity: res.data.quantity,
        isFeatured: res.data.isFeatured,

      });

      //  image preview ke liye
      if (res.data.image) {
        this.imageUrls = [res.data.image];

        // edit mode → image required nahi
        this.form.get('image')?.clearValidators();
        this.form.get('image')?.updateValueAndValidity();
      }
    });
  }

  onFileSelected(files: File[]) {
    if (files.length > 0) {
      this.selectedFile = files[0];

      this.form.patchValue({
        image: this.selectedFile
      });

      this.form.get('image')?.markAsTouched();
    }
  }

  buildFormData(): FormData {

    const formData = new FormData();

    formData.append('CategoryId', this.form.value.categoryId);

    formData.append('SubCategoryId', this.form.value.subCategoryId);

    formData.append('BrandId', this.form.value.brandId);

    formData.append('Name', this.form.value.name);

    formData.append('ShortDescription', this.form.value.shortDescription || '');

    formData.append('Description', this.form.value.description || '');

    formData.append('Price', this.form.value.price);
    formData.append('DiscountPercentage', this.form.value.discountPercentage);
    formData.append('DiscountPrice', this.form.value.discountPrice || 0);

    formData.append('Quantity', this.form.value.quantity);

    formData.append('IsFeatured', this.form.value.isFeatured);


    if (this.selectedFile) {
      formData.append('Image', this.selectedFile);
    }

    return formData;
  }


  saveProduct() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.form.value.discountPrice > this.form.value.price) {

      this.alert.error('Discount price cannot be greater than price');

      return;
    }
    this.loading = true;
    const formData = this.buildFormData();
    const request = this.isEdit
      ? this.productService.updateProduct(this.id, formData)
      : this.productService.addProduct(formData);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.alert.success('Saved successfully');
        this.router.navigate(['/admin/products']);
      },
      error: () => {
        this.loading = false;
        this.alert.error('Something went wrong');
      }
    });
  }
}


