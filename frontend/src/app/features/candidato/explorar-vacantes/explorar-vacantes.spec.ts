import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { JobService } from '../../../core/services/job';
import { ExplorarVacantesComponent } from './explorar-vacantes';

describe('ExplorarVacantes', () => {
  let component: ExplorarVacantesComponent;
  let fixture: ComponentFixture<ExplorarVacantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorarVacantesComponent],
      providers: [
        {
          provide: JobService,
          useValue: {
            getJobs: () => of({ content: [], last: true }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExplorarVacantesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
