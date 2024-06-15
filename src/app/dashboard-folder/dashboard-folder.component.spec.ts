import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFolderComponent } from './dashboard-folder.component';

describe('DashboardFolderComponent', () => {
  let component: DashboardFolderComponent;
  let fixture: ComponentFixture<DashboardFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardFolderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
