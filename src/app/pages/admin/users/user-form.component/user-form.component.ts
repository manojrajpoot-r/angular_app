import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user/user.service';
import { Inject } from '@angular/core';
import Swal from 'sweetalert2';
import { AlertService } from '../../../../services/alert/alert.service';
import { PasswordInputComponent } from '../../../../shared/password-input/password-input';
import { ValidationErrorComponent } from '../../../../shared/components/validation-error-component/validation-error-component';
import { SubmitButtonComponent } from '../../../../shared/components/submit-button-component/submit-button-component';
import { FormWrapperComponent } from '../../../../shared/components/form-wrapper-component/form-wrapper-component';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
@Component({
  standalone: true,
  selector: 'app-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ValidationErrorComponent,
    SubmitButtonComponent,
    FormWrapperComponent
  ],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {

  loading = false;
  form!: FormGroup;

  isEdit = false;
  id: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private userService: UserService,
    private alert: AlertService,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[a-zA-Z\s]+$/) // only letters + space
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        this.isEdit
          ? [] // edit me optional
          : [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)
          ]
      ]
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {
      this.isEdit = true;

      //  password validator remove karo
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();

      this.getUserById();
    }
  }



  getUserById() {
    this.userService.getUserById(this.id).subscribe((res: any) => {
      this.form.patchValue({
        name: res.data.name,
        email: res.data.email
      });
    });
  }



  saveUser() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload = this.form.value;

    if (this.isEdit) {
      this.userService.updateUser(this.id, payload).subscribe(() => {
        this.alert
          .success('User details have been updated successfully!!')
          .then(() => {
            this.router.navigate(['/admin/users']);
          });
      });
    } else {
      this.userService.addUser(payload).subscribe(() => {
        this.alert
          .success('New user has been added successfully!')
          .then(() => {
            this.router.navigate(['/admin/users']);
          });
      });
    }
  }

}
