import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrganizatoriComponent } from './admin-organizatori.component';

describe('AdminOrganizatoriComponent', () => {
  let component: AdminOrganizatoriComponent;
  let fixture: ComponentFixture<AdminOrganizatoriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminOrganizatoriComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOrganizatoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
