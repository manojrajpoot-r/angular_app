import {
  Component,
  input
} from '@angular/core';

import {
  AbstractControl
} from '@angular/forms';

import { CommonModule }
  from '@angular/common';

import {
  ValidationMessageService
} from '../../../services/validation-message.service';

import {
  fadeAnimation
} from '../../../animations/fade.animation';

@Component({

  selector:
    'app-validation-error-component',

  standalone: true,

  imports: [CommonModule],

  animations: [fadeAnimation],

  template: `

    @if (showErrors) {

      <div
        @fadeAnimation
        class="mt-1"
      >

        @for (
          error of errorMessages;
          track error
        ) {

          <small
            class="
              text-danger
              d-block
            "
          >

            {{ error }}

          </small>

        }

      </div>

    }

  `

})

export class ValidationErrorComponent {

  // ============================================
  // SIGNAL INPUTS
  // ============================================

  control =
    input<AbstractControl | null>(
      null
    );

  label =
    input<string>('Field');

  // ============================================
  // CONSTRUCTOR
  // ============================================

  constructor(

    private validationService:
      ValidationMessageService

  ) { }

  // ============================================
  // SHOW ERRORS
  // ============================================

  get showErrors(): boolean {

    const control =
      this.control();

    return !!(

      control &&
      control.invalid &&

      (
        control.touched ||
        control.dirty
      )

    );

  }

  // ============================================
  // ERROR MESSAGES
  // ============================================

  get errorMessages(): string[] {

    const control =
      this.control();

    if (!control?.errors) {
      return [];
    }

    const validations =

      this.validationService
        .getValidationMessages(
          this.label()
        );

    return Object.keys(
      control.errors
    ).map((key) => {

      const error =
        control.errors?.[key];

      const message =
        validations[
        key as keyof typeof validations
        ];

      return message
        ? message(error)
        : `Invalid ${this.label()}`;

    });

  }

}
