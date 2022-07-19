import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmployeeDetailsDetailComponent } from './employee-details-detail.component';

describe('EmployeeDetails Management Detail Component', () => {
  let comp: EmployeeDetailsDetailComponent;
  let fixture: ComponentFixture<EmployeeDetailsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeDetailsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ employeeDetails: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(EmployeeDetailsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EmployeeDetailsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load employeeDetails on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.employeeDetails).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
