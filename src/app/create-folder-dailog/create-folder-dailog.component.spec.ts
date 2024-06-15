import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFolderDailogComponent } from './create-folder-dailog.component';

describe('CreateFolderDailogComponent', () => {
  let component: CreateFolderDailogComponent;
  let fixture: ComponentFixture<CreateFolderDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFolderDailogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateFolderDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
