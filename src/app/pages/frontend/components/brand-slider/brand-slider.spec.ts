import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandSlider } from './brand-slider';

describe('BrandSlider', () => {
  let component: BrandSlider;
  let fixture: ComponentFixture<BrandSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandSlider],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandSlider);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
