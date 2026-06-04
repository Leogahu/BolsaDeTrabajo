import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCandidatos } from './gestion-candidatos';

describe('GestionCandidatos', () => {
  let component: GestionCandidatos;
  let fixture: ComponentFixture<GestionCandidatos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionCandidatos],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionCandidatos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
