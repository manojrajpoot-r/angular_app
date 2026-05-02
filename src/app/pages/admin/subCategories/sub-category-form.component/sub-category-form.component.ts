import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inject } from '@angular/core';
import Swal from 'sweetalert2';
import { AlertService } from '../../../../services/alert/alert.service';
import { SubCategoryService } from '../../../../services/subCategory/sub-category.service';
import { CategoryService } from '../../../../services/category/category.service';
import { ImageUploadComponent } from '../../../../shared/components/image-upload/image-upload';
@Component({
  standalone: true,
  selector: 'app-sub-category-form',
  imports: [CommonModule, FormsModule, ImageUploadComponent],
  templateUrl: './sub-category-form.component.html'
})
export class SubCategoryFormComponent implements OnInit {

  subcategory: any = {
    name: '',
  };

  isEdit = false;
  id: number = 0;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private subcategoryService: SubCategoryService,
    private alert: AlertService,
  ) { }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.isEdit = true;
      this.getSubCategoryById();
    }
  }

  getSubCategoryById() {
    this.subcategoryService.getSubCategoryById(this.id).subscribe((res: any) => {
      this.subcategory = res;
      console.log(this.subcategory);
    });
  }



  selectedFile?: File;

  onFileSelected(files: File[]) {

    if (files.length > 0) {
      this.selectedFile = files[0];
    }

  }

  private buildFormData(): FormData {

    const formData = new FormData();

    Object.keys(this.subcategory).forEach((key) => {

      const value = this.subcategory[key];

      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }

    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    return formData;
  }

  saveSubCategory() {

    const formData = this.buildFormData();

    const request = this.isEdit
      ? this.subcategoryService.updateSubCategory(this.id, formData)
      : this.subcategoryService.addSubCategory(formData);

    request.subscribe({

      next: () => {

        const message = this.isEdit
          ? 'SubCategory updated successfully!'
          : 'SubCategory added successfully!';

        this.alert.success(message).then(() => {

          this.router.navigate(['/admin/subcategories']);

        });

      },

      error: () => {

        this.alert.error('Something went wrong');

      }

    });

  }
}








