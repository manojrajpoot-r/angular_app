

import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SizeService } from '../../../../services/sizes/size';
import { AlertService } from '../../../../services/alert/alert.service';
import { ValidationErrorComponent } from '../../../../shared/components/validators/validation-error-component/validation-error-component';
import { SubmitButtonComponent } from '../../../../shared/components/submit-button-component/submit-button-component';
import { FormWrapperComponent } from '../../../../shared/components/form-wrapper-component/form-wrapper-component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-size-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ValidationErrorComponent,
    SubmitButtonComponent,
    FormWrapperComponent
  ],
  templateUrl: './size-form.html',
  styleUrl: './size-form.css'
})
export class SizeFormComponent implements OnInit {

  sizeForm!: FormGroup;
  submitted: boolean = false;
  isEditMode: boolean = false;
  sizeId: number = 0;
  loading: boolean = false;
  isEdit = false;
  constructor(
    private fb: FormBuilder,
    private sizeservice: SizeService,
    private alertService: AlertService,
    public router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.initializeForm();
    this.sizeId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.sizeId) {
      this.isEditMode = true;
      this.getSizeById();
    }


  }

  // FORM
  initializeForm(): void {

    this.sizeForm = this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],
    });
  }

  // GET BY ID
  getSizeById(): void {

    this.loading = true;

    this.sizeservice
      .getSizeById(this.sizeId)
      .subscribe({

        next: (response: any) => {

          this.sizeForm.patchValue({

            name: response.data.name
          });

          this.loading = false;
        },

        error: () => {

          this.loading = false;

          this.alertService.error('Failed to load color');
        }
      });
  }

  // SUBMIT
  onSubmit(): void {

    this.submitted = true;

    if (this.sizeForm.invalid) {

      this.sizeForm.markAllAsTouched();

      return;
    }

    this.loading = true;

    const payload = {

      id: this.sizeId,
      ...this.sizeForm.value
    };

    // UPDATE
    if (this.isEditMode) {

      this.sizeservice
        .updateSize(this.sizeId, payload)
        .subscribe({

          next: (response: any) => {

            this.loading = false;

            this.alertService.success(response.message);

            this.router.navigate(['admin/sizes']);
          },

          error: () => {

            this.loading = false;

            this.alertService.error('Update failed');
          }
        });
    }

    // ADD
    else {

      this.sizeservice
        .addSize(payload)
        .subscribe({

          next: (response: any) => {
            this.loading = false;
            this.alertService.success(response.message);
            this.router.navigate(['admin/sizes']);
          },

          error: () => {

            this.loading = false;

            this.alertService.error('Add failed');
          }
        });
    }
  }

  // FORM CONTROLS
  get f() {

    return this.sizeForm.controls;
  }
}
