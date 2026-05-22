import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inject } from '@angular/core';
import Swal from 'sweetalert2';
import { AlertService } from '../../../../services/alert/alert.service';
import { PermissionService } from '../../../../core/services/permission/permission.service';
import { DynamicInputComponent } from '../../../../shared/components/dynamic-input/dynamic-input';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ValidationErrorComponent } from '../../../../shared/components/validators/validation-error-component/validation-error-component';
import { SubmitButtonComponent } from '../../../../shared/components/submit-button-component/submit-button-component';
import { FormWrapperComponent } from '../../../../shared/components/form-wrapper-component/form-wrapper-component';
import { environment } from '../../../../environments/environment';
@Component({
  standalone: true,
  selector: 'app-permission-form',
  imports: [CommonModule, FormsModule,
    DynamicInputComponent, ReactiveFormsModule,
    ValidationErrorComponent, SubmitButtonComponent,
    FormWrapperComponent,

  ],
  templateUrl: './permission-form.component.html'
})


export class PermissionFormComponent implements OnInit {
  loading = false;

  form!: FormGroup;
  permission = {
    groupName: '',
    permissions: ['']
  };

  isEditMode = false;
  id: number = 0;

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private permissionService: PermissionService,
    private alert: AlertService,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      groupName: ['', Validators.required],
      permissions: this.fb.array([
        this.fb.control('')
      ])
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.isEditMode = true;
      this.getPermissionById();
    }
  }


  get permissionsArray(): FormArray {
    return this.form.get('permissions') as FormArray;
  }


  getPermissionById() {
    this.permissionService.getPermissionById(this.id).subscribe((res: any) => {
      this.permissionsArray.clear();
      this.permissionsArray.push(this.fb.control(res.data.name));

      this.form.patchValue({
        groupName: res.data.groupName
      });

    });
  }

  savePermission() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.isEditMode) {
      this.permissionService.updatePermission(this.id, this.permission).subscribe(() => {
        this.alert.success('Permission details have been updated successfully!');
        this.router.navigate(['/admin/permissions']);
      });
    } else {
      console.log(this.permission);
      this.permissionService.addPermission(this.permission).subscribe(() => {
        this.alert.success('New permission has been added successfully!');
        this.router.navigate(['/admin/permissions']);
      });
    }
  }
}
