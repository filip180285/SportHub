import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeniUcesnikComponent } from './meni-ucesnik.component';

describe('MeniUcesnikComponent', () => {
  let component: MeniUcesnikComponent;
  let fixture: ComponentFixture<MeniUcesnikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeniUcesnikComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeniUcesnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
