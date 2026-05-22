
import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ColorService } from '../../../../services/colors/color';
import { AlertService } from '../../../../services/alert/alert.service';
import { ValidationErrorComponent } from '../../../../shared/components/validators/validation-error-component/validation-error-component';
import { SubmitButtonComponent } from '../../../../shared/components/submit-button-component/submit-button-component';
import { FormWrapperComponent } from '../../../../shared/components/form-wrapper-component/form-wrapper-component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-color-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ValidationErrorComponent,
    SubmitButtonComponent,
    FormWrapperComponent
  ],
  templateUrl: './color-form.html',
  styleUrl: './color-form.css'
})
export class ColorFormComponent implements OnInit {

  colorForm!: FormGroup;
  submitted: boolean = false;
  isEditMode: boolean = false;
  colorId: number = 0;
  loading: boolean = false;
  isEdit = false;
  constructor(
    private fb: FormBuilder,
    private colorService: ColorService,
    private alertService: AlertService,
    public router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.initializeForm();
    this.colorId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.colorId) {
      this.isEditMode = true;
      this.getColorById();
    }

    console.log('colorId:', this.colorId);        // ADD THIS
    console.log('isEditMode:', this.isEditMode);
  }

  // FORM
  initializeForm(): void {

    this.colorForm = this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],

      code: [
        '',
        [
          Validators.required
        ]
      ]
    });
  }

  // GET BY ID
  getColorById(): void {

    this.loading = true;

    this.colorService
      .getColorById(this.colorId)
      .subscribe({

        next: (response: any) => {

          this.colorForm.patchValue({

            name: response.data.name,
            code: response.data.code
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

    if (this.colorForm.invalid) {

      this.colorForm.markAllAsTouched();

      return;
    }

    this.loading = true;

    const payload = {

      id: this.colorId,
      ...this.colorForm.value
    };

    // UPDATE
    if (this.isEditMode) {

      this.colorService
        .updateColor(this.colorId, payload)
        .subscribe({

          next: (response: any) => {

            this.loading = false;

            this.alertService.success(response.message);

            this.router.navigate(['admin/colors']);
          },

          error: () => {

            this.loading = false;

            this.alertService.error('Update failed');
          }
        });
    }

    // ADD
    else {

      this.colorService
        .addColor(payload)
        .subscribe({

          next: (response: any) => {

            this.loading = false;

            this.alertService.success(response.message);

            this.router.navigate(['admin/colors']);
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

    return this.colorForm.controls;
  }
}
