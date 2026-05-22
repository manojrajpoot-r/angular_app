import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-wrapper-component',
  standalone: true,
  imports: [CommonModule],
  template: `
   <div class="container-fluid py-4">

  <div class="row justify-content-center">

    <div class="col-md-7">

      <div class="card border-0 shadow-lg rounded-4">

        <div class="card-body p-5">

        <h4 class="mb-4 text-center fw-bold">
          {{ title }}
        </h4>

        <ng-content></ng-content>

      </div>

      </div>

    </div>

  </div>

</div>

  `
})
export class FormWrapperComponent {
  @Input() title = '';
}
