import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPrikazProfilaComponent } from './admin-prikaz-profila.component';

describe('AdminPrikazProfilaComponent', () => {
  let component: AdminPrikazProfilaComponent;
  let fixture: ComponentFixture<AdminPrikazProfilaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPrikazProfilaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPrikazProfilaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
