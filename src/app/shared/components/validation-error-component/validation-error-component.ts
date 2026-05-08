import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validation-error-component',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="control && control.touched && control.errors">

      <small class="text-danger" *ngFor="let error of errorMessages">
        {{ error }}
      </small>

    </div>
  `
})
export class ValidationErrorComponent {

  @Input() control!: AbstractControl | null;

  get errorMessages(): string[] {

    if (!this.control?.errors) return [];

    const errors = this.control.errors;
    const messages: string[] = [];

    if (errors['required']) {
      messages.push('This field is required');
    }

    if (errors['minlength']) {
      messages.push(`Minimum ${errors['minlength'].requiredLength} characters required`);
    }

    if (errors['maxlength']) {
      messages.push(`Maximum ${errors['maxlength'].requiredLength} characters allowed`);
    }

    if (errors['email']) {
      messages.push('Invalid email format');
    }

    return messages;
  }
}
