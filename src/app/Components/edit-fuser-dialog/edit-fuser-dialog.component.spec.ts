import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFUserDialogComponent } from './edit-fuser-dialog.component';

describe('EditFUserDialogComponent', () => {
  let component: EditFUserDialogComponent;
  let fixture: ComponentFixture<EditFUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditFUserDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditFUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
