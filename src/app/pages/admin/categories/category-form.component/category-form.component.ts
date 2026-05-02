import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inject } from '@angular/core';
import Swal from 'sweetalert2';
import { AlertService } from '../../../../services/alert/alert.service';
import { CategoryService } from '../../../../services/category/category.service';
@Component({
  standalone: true,
  selector: 'app-category-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './category-form.component.html'
})
export class CategoryFormComponent implements OnInit {

  category: any = {
    name: '',
  };

  isEdit = false;
  id: number = 0;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private categoryService: CategoryService,
    private alert: AlertService,
  ) { }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.isEdit = true;
      this.getCategoryById();
    }
  }

  getCategoryById() {
    this.categoryService.getCategoryById(this.id).subscribe((res: any) => {
      this.category = res;
      console.log(this.category);
    });
  }

  saveCategory() {
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
