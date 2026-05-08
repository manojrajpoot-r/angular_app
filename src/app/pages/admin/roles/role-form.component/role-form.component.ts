import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inject } from '@angular/core';
import Swal from 'sweetalert2';
import { AlertService } from '../../../../services/alert/alert.service';
import { RoleService } from '../../../../core/services/roles/role.service';
import { ValidationErrorComponent } from '../../../../shared/components/validation-error-component/validation-error-component';
import { SubmitButtonComponent } from '../../../../shared/components/submit-button-component/submit-button-component';
import { FormWrapperComponent } from '../../../../shared/components/form-wrapper-component/form-wrapper-component';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-role-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ValidationErrorComponent,
    SubmitButtonComponent,
    FormWrapperComponent
  ],
  templateUrl: './role-form.component.html'
})
export class RoleFormComponent implements OnInit {

  loading = false;
  form!: FormGroup;

  isEdit = false;
  id: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private roleService: RoleService,
    private alert: AlertService,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.isEdit = true;
      this.getRoleById();
    }
  }



  getRoleById() {
    this.roleService.getRoleById(this.id).subscribe((res: any) => {
      this.form.patchValue({
        name: res.data.name,
      });
    });
  }



  saveRole() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload = this.form.value;

    if (this.isEdit) {
      this.roleService.updateRole(this.id, payload).subscribe(() => {
        this.alert
          .success('Role details have been updated successfully!!')
          .then(() => {
            this.router.navigate(['/admin/roles']);
          });
      });
    } else {
      this.roleService.addRole(payload).subscribe(() => {
        this.alert
          .success('New role has been added successfully!')
          .then(() => {
            this.router.navigate(['/admin/roles']);
          });
      });
    }
  }
}
