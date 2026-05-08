import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-submit-button-component',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button type="submit" class="btn btn-primary w-100" [disabled]="loading">

      <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>

      {{ loading ? 'Processing...' : text }}

    </button>
  `
})
export class SubmitButtonComponent {
  @Input() loading = false;
  @Input() text = 'Submit';
}
