import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDailogComponent } from './filter-dailog.component';

describe('FilterDailogComponent', () => {
  let component: FilterDailogComponent;
  let fixture: ComponentFixture<FilterDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterDailogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
