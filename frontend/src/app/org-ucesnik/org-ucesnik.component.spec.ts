import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgUcesnikComponent } from './org-ucesnik.component';

describe('OrgUcesnikComponent', () => {
  let component: OrgUcesnikComponent;
  let fixture: ComponentFixture<OrgUcesnikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgUcesnikComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgUcesnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
