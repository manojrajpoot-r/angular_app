

import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceSevice } from '../../../../services/service/service.service';
import { AlertService } from '../../../../services/alert/alert.service';
import { ValidationErrorComponent } from '../../../../shared/components/validators/validation-error-component/validation-error-component';
import { SubmitButtonComponent } from '../../../../shared/components/submit-button-component/submit-button-component';
import { FormWrapperComponent } from '../../../../shared/components/form-wrapper-component/form-wrapper-component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-services-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ValidationErrorComponent,
    SubmitButtonComponent,
    FormWrapperComponent
  ],
  templateUrl: './services-form.html',
  styleUrl: './services-form.css',
})
export class ServicesFormComponent implements OnInit {

  serviceForm!: FormGroup;
  submitted: boolean = false;
  isEditMode: boolean = false;
  serviceId: number = 0;
  loading: boolean = false;
  isEdit = false;
  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceSevice,
    private alertService: AlertService,
    public router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.initializeForm();
    this.serviceId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.serviceId) {
      this.isEditMode = true;
      this.getServiceById();
    }

    console.log('serviceId:', this.serviceId);        // ADD THIS
    console.log('isEditMode:', this.isEditMode);
  }

  // FORM
  initializeForm(): void {

    this.serviceForm = this.fb.group({

      serviceName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],

      price: [
        '',
        [
          Validators.required
        ]
      ],

      durationMinutes: [
        '',
        [
          Validators.required
        ]
      ]
    });
  }

  // GET BY ID
  getServiceById(): void {

    this.loading = true;

    this.serviceService
      .getServiceById(this.serviceId)
      .subscribe({

        next: (response: any) => {

          this.serviceForm.patchValue({

            serviceName: response.data.serviceName,
            price: response.data.price,
            durationMinutes: response.data.durationMinutes
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

    if (this.serviceForm.invalid) {

      this.serviceForm.markAllAsTouched();

      return;
    }

    this.loading = true;

    const payload = {

      id: this.serviceId,
      ...this.serviceForm.value
    };

    // UPDATE
    if (this.isEditMode) {

      this.serviceService
        .updateService(this.serviceId, payload)
        .subscribe({

          next: (response: any) => {

            this.loading = false;

            this.alertService.success(response.message);

            this.router.navigate(['admin/services']);
          },

          error: () => {

            this.loading = false;

            this.alertService.error('Update failed');
          }
        });
    }

    // ADD
    else {

      this.serviceService
        .addService(payload)
        .subscribe({

          next: (response: any) => {

            this.loading = false;

            this.alertService.success(response.message);

            this.router.navigate(['admin/services']);
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

    return this.serviceForm.controls;
  }
}
