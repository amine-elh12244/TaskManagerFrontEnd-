import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDetailDialogComponentComponent } from './add-detail-dialog-component.component';

describe('AddDetailDialogComponentComponent', () => {
  let component: AddDetailDialogComponentComponent;
  let fixture: ComponentFixture<AddDetailDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddDetailDialogComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddDetailDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
