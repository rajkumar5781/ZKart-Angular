import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddresscartsComponent } from './addresscarts.component';

describe('AddresscartsComponent', () => {
  let component: AddresscartsComponent;
  let fixture: ComponentFixture<AddresscartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddresscartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddresscartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
