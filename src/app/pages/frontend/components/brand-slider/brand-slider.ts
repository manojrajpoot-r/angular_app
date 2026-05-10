import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-brand-slider',
  imports: [CommonModule],
  templateUrl: './brand-slider.html',
  styleUrl: './brand-slider.css',
})
export class BrandSliderComponent {

   @Input() brand: any;
}
