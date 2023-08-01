import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizatorDogadjajComponent } from './organizator-dogadjaj.component';

describe('OrganizatorDogadjajComponent', () => {
  let component: OrganizatorDogadjajComponent;
  let fixture: ComponentFixture<OrganizatorDogadjajComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizatorDogadjajComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizatorDogadjajComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
