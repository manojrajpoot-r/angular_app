import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ValidationMessageService {

  getValidationMessages(
    label: string
  ) {

    return {

      required: () => `${label} is required`,

      email: () => `Please enter valid email`,

      minlength: (error: any) => `${label} must be at least ${error.requiredLength} characters`,

      maxlength: (error: any) => `${label} cannot exceed ${error.requiredLength} characters`,

      pattern: () => `${label} format is invalid`

    };

  }

}
