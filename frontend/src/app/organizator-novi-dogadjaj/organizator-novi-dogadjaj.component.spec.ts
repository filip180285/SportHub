import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizatorNoviDogadjajComponent } from './organizator-novi-dogadjaj.component';

describe('OrganizatorNoviDogadjajComponent', () => {
  let component: OrganizatorNoviDogadjajComponent;
  let fixture: ComponentFixture<OrganizatorNoviDogadjajComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizatorNoviDogadjajComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizatorNoviDogadjajComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
