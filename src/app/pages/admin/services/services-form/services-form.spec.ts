import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesForm } from './services-form';

describe('ServicesForm', () => {
  let component: ServicesForm;
  let fixture: ComponentFixture<ServicesForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicesForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
