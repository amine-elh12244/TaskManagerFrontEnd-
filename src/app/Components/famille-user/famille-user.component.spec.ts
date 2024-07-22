import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilleUserComponent } from './famille-user.component';

describe('FamilleUserComponent', () => {
  let component: FamilleUserComponent;
  let fixture: ComponentFixture<FamilleUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FamilleUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FamilleUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
