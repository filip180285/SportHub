import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcesnikAzuriranjeComponent } from './ucesnik-azuriranje.component';

describe('UcesnikAzuriranjeComponent', () => {
  let component: UcesnikAzuriranjeComponent;
  let fixture: ComponentFixture<UcesnikAzuriranjeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UcesnikAzuriranjeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcesnikAzuriranjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
