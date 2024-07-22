import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserDialogComponentComponent } from './edit-user-dialog-component.component';

describe('EditUserDialogComponentComponent', () => {
  let component: EditUserDialogComponentComponent;
  let fixture: ComponentFixture<EditUserDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditUserDialogComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditUserDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
