import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeniOrganizatorComponent } from './meni-organizator.component';

describe('MeniOrganizatorComponent', () => {
  let component: MeniOrganizatorComponent;
  let fixture: ComponentFixture<MeniOrganizatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeniOrganizatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeniOrganizatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
