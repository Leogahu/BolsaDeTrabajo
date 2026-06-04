import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicarOferta } from './publicar-oferta';

describe('PublicarOferta', () => {
  let component: PublicarOferta;
  let fixture: ComponentFixture<PublicarOferta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicarOferta],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicarOferta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
