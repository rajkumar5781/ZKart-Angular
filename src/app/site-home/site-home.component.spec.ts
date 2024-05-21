import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteHomeComponent } from './site-home.component';

describe('SiteHomeComponent', () => {
  let component: SiteHomeComponent;
  let fixture: ComponentFixture<SiteHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiteHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
