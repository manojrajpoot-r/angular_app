import { TestBed } from '@angular/core/testing';

import { AssignUserRoleService } from './assign-user-role.service';

describe('AssignUserRoleService', () => {
  let service: AssignUserRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignUserRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
