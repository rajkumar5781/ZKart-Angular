import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendersListComponent } from './venders-list.component';

describe('VendersListComponent', () => {
  let component: VendersListComponent;
  let fixture: ComponentFixture<VendersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendersListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
