import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceState } from './service-state';

describe('ServiceState', () => {
  let component: ServiceState;
  let fixture: ComponentFixture<ServiceState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceState],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceState);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
