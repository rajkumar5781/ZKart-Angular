import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductquntitycounterComponent } from './productquntitycounter.component';

describe('ProductquntitycounterComponent', () => {
  let component: ProductquntitycounterComponent;
  let fixture: ComponentFixture<ProductquntitycounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductquntitycounterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductquntitycounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
