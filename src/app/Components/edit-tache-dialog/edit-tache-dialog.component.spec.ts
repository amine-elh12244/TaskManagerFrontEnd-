import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTacheDialogComponent } from './edit-tache-dialog.component';

describe('EditTacheDialogComponent', () => {
  let component: EditTacheDialogComponent;
  let fixture: ComponentFixture<EditTacheDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditTacheDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditTacheDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
