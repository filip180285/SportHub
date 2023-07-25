import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcesnikProfilComponent } from './ucesnik-profil.component';

describe('UcesnikProfilComponent', () => {
  let component: UcesnikProfilComponent;
  let fixture: ComponentFixture<UcesnikProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UcesnikProfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcesnikProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
