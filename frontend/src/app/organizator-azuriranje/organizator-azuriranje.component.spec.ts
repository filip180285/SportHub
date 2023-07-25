import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizatorAzuriranjeComponent } from './organizator-azuriranje.component';

describe('OrganizatorAzuriranjeComponent', () => {
  let component: OrganizatorAzuriranjeComponent;
  let fixture: ComponentFixture<OrganizatorAzuriranjeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizatorAzuriranjeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizatorAzuriranjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
