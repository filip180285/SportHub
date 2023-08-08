import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DopunaProfilComponent } from './dopuna-profil.component';

describe('DopunaProfilComponent', () => {
  let component: DopunaProfilComponent;
  let fixture: ComponentFixture<DopunaProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DopunaProfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DopunaProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
