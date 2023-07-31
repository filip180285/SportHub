import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcesnikDogadjajComponent } from './ucesnik-dogadjaj.component';

describe('UcesnikDogadjajComponent', () => {
  let component: UcesnikDogadjajComponent;
  let fixture: ComponentFixture<UcesnikDogadjajComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UcesnikDogadjajComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcesnikDogadjajComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
