import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDashboardDailogComponent } from './create-dashboard-dailog.component';

describe('CreateDashboardDailogComponent', () => {
  let component: CreateDashboardDailogComponent;
  let fixture: ComponentFixture<CreateDashboardDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDashboardDailogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateDashboardDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
