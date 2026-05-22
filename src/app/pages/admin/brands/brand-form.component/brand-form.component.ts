
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrandService } from '../../../../services/brands/brand.service';
import { CategoryService } from '../../../../services/category/category.service';
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
  templateUrl: './brand-form.component.html'
})
export class BrandFormComponent implements OnInit {

  loading = false;
  form!: FormGroup;
  brands: any[] = [];
  selectedFile!: File;

  isEdit = false;
  id = 0;
  imageUrls: string[] = [];
  constructor(
    private fb: FormBuilder,
    private brandservice: BrandService,
    private route: ActivatedRoute,
    public router: Router,
    private alert: AlertService
  ) { }



  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      image: [null, Validators.required]
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBrands();
    if (this.id) {
      this.isEdit = true;
      this.getById();
    }
  }

  loadBrands() {
    this.brandservice.getBrands(1, 100, '').subscribe((res: any) => {
      this.brands = res;
    });
  }

  getById() {
    this.brandservice.getBrandById(this.id).subscribe((res: any) => {

      this.form.patchValue({
        name: res.data.name,
        description: res.data.description,
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

    formData.append('Name', this.form.value.name);
    formData.append('Description', this.form.value.description || '');
    formData.append('CategoryId', this.form.value.categoryId);

    if (this.selectedFile) {
      formData.append('Image', this.selectedFile);
    }

    return formData;
  }


  saveBrand() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.buildFormData();
    const request = this.isEdit
      ? this.brandservice.updateBrand(this.id, formData)
      : this.brandservice.addBrand(formData);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.alert.success('Saved successfully');
        this.router.navigate(['/admin/brands']);
      },
      error: () => {
        this.loading = false;
        this.alert.error('Something went wrong');
      }
    });
  }
}


