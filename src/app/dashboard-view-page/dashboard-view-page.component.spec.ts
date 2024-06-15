import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardViewPageComponent } from './dashboard-view-page.component';

describe('DashboardViewPageComponent', () => {
  let component: DashboardViewPageComponent;
  let fixture: ComponentFixture<DashboardViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardViewPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
