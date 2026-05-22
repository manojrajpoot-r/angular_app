import { TestBed } from '@angular/core/testing';

import { ProductVarient } from './product-varient';

describe('ProductVarient', () => {
  let service: ProductVarient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductVarient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
