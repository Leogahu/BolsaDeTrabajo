import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalEmpresa } from './portal-empresa';

describe('PortalEmpresa', () => {
  let component: PortalEmpresa;
  let fixture: ComponentFixture<PortalEmpresa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalEmpresa],
    }).compileComponents();

    fixture = TestBed.createComponent(PortalEmpresa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
