import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldConditionComponent } from './field-condition.component';

describe('FieldConditionComponent', () => {
  let component: FieldConditionComponent;
  let fixture: ComponentFixture<FieldConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldConditionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FieldConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
