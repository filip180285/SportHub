import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDogadjajComponent } from './admin-dogadjaj.component';

describe('AdminDogadjajComponent', () => {
  let component: AdminDogadjajComponent;
  let fixture: ComponentFixture<AdminDogadjajComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDogadjajComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDogadjajComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
