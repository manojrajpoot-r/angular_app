import { TestBed } from '@angular/core/testing';

import { PermissionAuth } from './permission-auth';

describe('PermissionAuth', () => {
  let service: PermissionAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionAuth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
