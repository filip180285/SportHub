import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAzuriranjeComponent } from './admin-azuriranje.component';

describe('AdminAzuriranjeComponent', () => {
  let component: AdminAzuriranjeComponent;
  let fixture: ComponentFixture<AdminAzuriranjeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAzuriranjeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAzuriranjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
