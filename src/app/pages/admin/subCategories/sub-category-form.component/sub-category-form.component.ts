import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SubCategoryService } from '../../../../services/subCategory/sub-category.service';
import { CategoryService } from '../../../../services/category/category.service';
import { AlertService } from '../../../../services/alert/alert.service';
import { ImageUploadComponent } from '../../../../shared/components/image-upload/image-upload';
import { ValidationErrorComponent } from '../../../../shared/components/validators/validation-error-component/validation-error-component';
import { SubmitButtonComponent } from '../../../../shared/components/submit-button-component/submit-button-component';
import { FormWrapperComponent } from '../../../../shared/components/form-wrapper-component/form-wrapper-component';

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

  templateUrl: './sub-category-form.component.html'

})

export class SubCategoryFormComponent implements OnInit {

  // ============================================
  // DEPENDENCY INJECTION
  // ============================================

  private fb = inject(FormBuilder);
  private service = inject(SubCategoryService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private alert = inject(AlertService);

  // ============================================
  // SIGNALS
  // ============================================

  loading = signal(false);
  categories = signal<any[]>([]);
  imageUrls = signal<string[]>([]);

  // ============================================
  // VARIABLES
  // ============================================

  selectedFile: File | null = null;
  isEditMode = false;
  id = 0;

  // ============================================
  // FORM
  // ============================================

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    categoryId: ['', Validators.required],
    image: [null]
  });

  // ============================================
  // INIT
  // ============================================
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.loadCategories();
    if (this.id) {
      this.isEditMode = true;
      this.getById();
    } else {
      this.form.get('image')?.setValidators(Validators.required);
    }
  }

  // ============================================
  // LOAD CATEGORIES
  // ============================================

  loadCategories(): void {
    this.categoryService.getCategorys(1, 100, '')
      .subscribe({
        next: (res: any) => {
          this.categories.set(res);
        }
      });

  }

  // ============================================
  // GET BY ID
  // ============================================

  getById(): void {
    this.service
      .getSubCategoryById(this.id)
      .subscribe({
        next: (res: any) => {
          this.form.patchValue({
            name: res.name,
            description: res.description,
            categoryId: res.categoryId
          });

          if (res.image) {
            this.imageUrls.set([res.image]);
          }
        }
      });
  }

  // ============================================
  // FILE SELECT
  // ============================================

  onFileSelected(files: File[]): void {
    if (files.length) {
      this.selectedFile = files[0];
      this.form.patchValue({ image: this.selectedFile });
    }
  }  // ============================================
  // BUILD FORM DATA
  // ============================================

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

  // ============================================
  // SAVE
  // ============================================

  saveSubCategory(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formData = this.buildFormData();
    const request = this.isEditMode ? this.service.updateSubCategory(this.id, formData) : this.service.addSubCategory(formData);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.alert.success('Sub category saved successfully');
        this.router.navigate(['/admin/sub-categories']);
      },

      error: () => {
        this.loading.set(false);
        this.alert.error('Something went wrong');
      }
    });

  }

}
