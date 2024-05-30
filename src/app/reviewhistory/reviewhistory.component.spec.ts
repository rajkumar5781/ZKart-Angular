import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewhistoryComponent } from './reviewhistory.component';

describe('ReviewhistoryComponent', () => {
  let component: ReviewhistoryComponent;
  let fixture: ComponentFixture<ReviewhistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewhistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
