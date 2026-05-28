import { TestBed } from '@angular/core/testing';

import { ServiceSevice } from './service.service';

describe('ServiceSevice', () => {
  let service: ServiceSevice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceSevice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
