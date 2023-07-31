import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcesnikOrganizatoriComponent } from './ucesnik-organizatori.component';

describe('UcesnikOrganizatoriComponent', () => {
  let component: UcesnikOrganizatoriComponent;
  let fixture: ComponentFixture<UcesnikOrganizatoriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UcesnikOrganizatoriComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcesnikOrganizatoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
