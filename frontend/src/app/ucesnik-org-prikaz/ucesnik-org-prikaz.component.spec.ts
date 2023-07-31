import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcesnikOrgPrikazComponent } from './ucesnik-org-prikaz.component';

describe('UcesnikOrgPrikazComponent', () => {
  let component: UcesnikOrgPrikazComponent;
  let fixture: ComponentFixture<UcesnikOrgPrikazComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UcesnikOrgPrikazComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcesnikOrgPrikazComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
