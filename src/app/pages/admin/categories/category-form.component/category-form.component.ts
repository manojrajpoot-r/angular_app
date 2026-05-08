import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inject } from '@angular/core';
import Swal from 'sweetalert2';
import { AlertService } from '../../../../services/alert/alert.service';
import { CategoryService } from '../../../../services/category/category.service';
import { ValidationErrorComponent } from '../../../../shared/components/validation-error-component/validation-error-component';
import { SubmitButtonComponent } from '../../../../shared/components/submit-button-component/submit-button-component';
import { FormWrapperComponent } from '../../../../shared/components/form-wrapper-component/form-wrapper-component';
import { environment } from '../../../../environments/environment';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  standalone: true,
  selector: 'app-category-form',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ValidationErrorComponent,
    SubmitButtonComponent,
    FormWrapperComponent
  ],
  templateUrl: './category-form.component.html'
})
export class CategoryFormComponent implements OnInit {

  category: any = {
    name: '',
  };

  isEdit = false;
  id: number = 0;

  form!: FormGroup;
  loading = false;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private categoryService: CategoryService,
    private alert: AlertService,
  ) { }

  ngOnInit() {

    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.isEdit = true;
      this.getCategoryById();
    }
  }

  getCategoryById() {
    this.categoryService.getCategoryById(this.id).subscribe((res: any) => {
      this.form.patchValue({
        name: res.name,
        description: res.description
      });
    });
  }

  saveCategory() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.isEdit) {
      this.categoryService.updateCategory(this.id, this.category).subscribe(() => {
        this.alert
          .success('Category details have been updated successfully!!')
          .then(() => {

            this.router.navigate(['/admin/categories']);

          });
      });
    } else {
      this.categoryService.addCategory(this.category).subscribe(() => {

        this.alert
          .success('New category has been added successfully!')
          .then(() => {

            this.router.navigate(['/admin/categories']);

          });

      });
    }
  }
}
