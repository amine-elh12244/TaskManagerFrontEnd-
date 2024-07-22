import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectataionTachesComponent } from './affectataion-taches.component';

describe('AffectataionTachesComponent', () => {
  let component: AffectataionTachesComponent;
  let fixture: ComponentFixture<AffectataionTachesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AffectataionTachesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AffectataionTachesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
