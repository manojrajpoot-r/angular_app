import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-brand-slider',
  imports: [CommonModule],
  templateUrl: './brand-slider.html',
  styleUrl: './brand-slider.css',
})
export class BrandSliderComponent {
  imageBaseUrl = environment.apiUrlImage;
  @Input() brand: any;
}
