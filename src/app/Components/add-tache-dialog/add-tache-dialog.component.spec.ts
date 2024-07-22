import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTacheDialogComponent } from './add-tache-dialog.component';

describe('AddTacheDialogComponent', () => {
  let component: AddTacheDialogComponent;
  let fixture: ComponentFixture<AddTacheDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTacheDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTacheDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
