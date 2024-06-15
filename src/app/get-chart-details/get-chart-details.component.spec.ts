import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetChartDetailsComponent } from './get-chart-details.component';

describe('GetChartDetailsComponent', () => {
  let component: GetChartDetailsComponent;
  let fixture: ComponentFixture<GetChartDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetChartDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetChartDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
