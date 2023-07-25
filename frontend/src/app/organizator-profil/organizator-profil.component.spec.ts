import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizatorProfilComponent } from './organizator-profil.component';

describe('OrganizatorProfilComponent', () => {
  let component: OrganizatorProfilComponent;
  let fixture: ComponentFixture<OrganizatorProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizatorProfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizatorProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
