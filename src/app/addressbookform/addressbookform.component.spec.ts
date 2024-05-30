import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressbookformComponent } from './addressbookform.component';

describe('AddressbookformComponent', () => {
  let component: AddressbookformComponent;
  let fixture: ComponentFixture<AddressbookformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressbookformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddressbookformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
