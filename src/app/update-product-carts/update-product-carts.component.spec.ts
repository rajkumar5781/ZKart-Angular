import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProductCartsComponent } from './update-product-carts.component';

describe('UpdateProductCartsComponent', () => {
  let component: UpdateProductCartsComponent;
  let fixture: ComponentFixture<UpdateProductCartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProductCartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateProductCartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
