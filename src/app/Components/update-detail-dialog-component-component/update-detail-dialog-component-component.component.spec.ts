import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDetailDialogComponentComponentComponent } from './update-detail-dialog-component-component.component';

describe('UpdateDetailDialogComponentComponentComponent', () => {
  let component: UpdateDetailDialogComponentComponentComponent;
  let fixture: ComponentFixture<UpdateDetailDialogComponentComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateDetailDialogComponentComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateDetailDialogComponentComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
