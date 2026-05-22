import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVarientForm } from './product-varient-form';

describe('ProductVarientForm', () => {
  let component: ProductVarientForm;
  let fixture: ComponentFixture<ProductVarientForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductVarientForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductVarientForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
