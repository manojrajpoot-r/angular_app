import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorForm } from './color-form';

describe('ColorForm', () => {
  let component: ColorForm;
  let fixture: ComponentFixture<ColorForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
