import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandFormComponent } from './brand-form.component';

describe('BrandFormComponent', () => {
  let component: BrandFormComponent;
  let fixture: ComponentFixture<BrandFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
