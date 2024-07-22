import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFUserDialogComponent } from './add-fuser-dialog.component';

describe('AddFUserDialogComponent', () => {
  let component: AddFUserDialogComponent;
  let fixture: ComponentFixture<AddFUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddFUserDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
