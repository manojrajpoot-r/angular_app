import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-submit-button-component',
  standalone: true,
  imports: [CommonModule],
  template: `
     <button
                type="submit"
                class="btn btn-primary px-5 rounded-pill"
                [disabled]="loading">

                <span
                  *ngIf="loading"
                  class="spinner-border spinner-border-sm me-2">
                </span>


      {{ loading ? 'Processing...' : text }}

    </button>
  `
})
export class SubmitButtonComponent {
  @Input() loading = false;
  @Input() text = 'Submit';
}
