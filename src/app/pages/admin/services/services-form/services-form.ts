import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceSevice } from '../../../../services/service/service.service';
import { AlertService } from '../../../../services/alert/alert.service';
import { ValidationErrorComponent } from '../../../../shared/components/validators/validation-error-component/validation-error-component';
import { SubmitButtonComponent } from '../../../../shared/components/submit-button-component/submit-button-component';
import { FormWrapperComponent } from '../../../../shared/components/form-wrapper-component/form-wrapper-component';
import { ImageUploadComponent } from '../../../../shared/components/image-upload/image-upload';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-services-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ValidationErrorComponent,
    SubmitButtonComponent,
    FormWrapperComponent,
    ImageUploadComponent,
    QuillModule,
  ],
  templateUrl: './services-form.html',
  styleUrl: './services-form.css',
})
export class ServicesFormComponent implements OnInit {

  serviceForm!: FormGroup;
  submitted = false;
  isEditMode = false;
  serviceId = 0;
  loading = false;
  imageUrls: string[] = [];
  selectedFile!: File;

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceSevice,
    private alertService: AlertService,
    public router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      serviceName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      price: ['', Validators.required],
      durationMinutes: ['', Validators.required],
      description: [null],
      imageUrl: [null, Validators.required]
    });

    this.serviceId = Number(this.route.snapshot.paramMap.get('id'));
    alert(this.serviceId);
    if (this.serviceId) {
      this.isEditMode = true;
      this.getServiceById();
    }
  }

  getServiceById(): void {
    this.loading = true;
    this.serviceService.getServiceById(this.serviceId).subscribe({
      next: (response: any) => {
        this.serviceForm.patchValue({
          serviceName: response.data.serviceName,
          price: response.data.price,
          durationMinutes: response.data.durationMinutes,
          description: response.data.description,
        });

        //  Edit mode mein purani image dikhao
        if (response.data.imageUrl) {
          this.imageUrls = [response.data.imageUrl];

          // Edit mode mein image required nahi
          this.serviceForm.get('imageUrl')?.clearValidators();
          this.serviceForm.get('imageUrl')?.updateValueAndValidity();
        }

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.error('Failed to load service');
      }
    });
  }

  onFileSelected(files: File[]) {
    if (files.length > 0) {
      this.selectedFile = files[0];
      this.serviceForm.patchValue({ imageUrl: this.selectedFile });
      this.serviceForm.get('imageUrl')?.markAsTouched();
    }
  }

  buildFormData(): FormData {

    const formData = new FormData();

    if (this.isEditMode) {
      formData.append('Id', this.serviceId.toString());
    }

    formData.append('ServiceName', this.serviceForm.value.serviceName);
    formData.append('Price', this.serviceForm.value.price);
    formData.append('DurationMinutes', this.serviceForm.value.durationMinutes);
    formData.append('Description', this.serviceForm.value.description || '');

    if (this.selectedFile) {
      formData.append('ImageUrl', this.selectedFile);
    }

    return formData;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.buildFormData();


    const request = this.isEditMode
      ? this.serviceService.updateService(this.serviceId, formData)
      : this.serviceService.addService(formData);

    request.subscribe({
      next: (response: any) => {
        this.loading = false;
        this.alertService.success(response.message);
        this.router.navigate(['admin/services']);
      },
      error: () => {
        this.loading = false;
        this.alertService.error(this.isEditMode ? 'Update failed' : 'Add failed');
      }
    });
  }

  get f() {
    return this.serviceForm.controls;
  }
}
