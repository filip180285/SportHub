import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcesnikComponent } from './ucesnik.component';

describe('UcesnikComponent', () => {
  let component: UcesnikComponent;
  let fixture: ComponentFixture<UcesnikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UcesnikComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcesnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
