import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-wrapper-component',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card shadow-lg border-0 mt-4" style="max-width: 500px; margin:auto;">
      <div class="card-body">

        <h4 class="mb-4 text-center fw-bold">
          {{ title }}
        </h4>

        <ng-content></ng-content>

      </div>
    </div>
  `
})
export class FormWrapperComponent {
  @Input() title = '';
}
