import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicInput } from './dynamic-input';

describe('DynamicInput', () => {
  let component: DynamicInput;
  let fixture: ComponentFixture<DynamicInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicInput],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
