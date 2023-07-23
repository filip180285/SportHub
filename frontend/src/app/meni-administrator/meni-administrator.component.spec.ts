import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeniAdministratorComponent } from './meni-administrator.component';

describe('MeniAdministratorComponent', () => {
  let component: MeniAdministratorComponent;
  let fixture: ComponentFixture<MeniAdministratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeniAdministratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeniAdministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
