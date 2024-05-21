import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppHelloWorldComponent } from './app-hello-world.component';

describe('AppHelloWorldComponent', () => {
  let component: AppHelloWorldComponent;
  let fixture: ComponentFixture<AppHelloWorldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppHelloWorldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppHelloWorldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
