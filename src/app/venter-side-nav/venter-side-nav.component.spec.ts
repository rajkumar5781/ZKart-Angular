import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenterSideNavComponent } from './venter-side-nav.component';

describe('VenterSideNavComponent', () => {
  let component: VenterSideNavComponent;
  let fixture: ComponentFixture<VenterSideNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenterSideNavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VenterSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
