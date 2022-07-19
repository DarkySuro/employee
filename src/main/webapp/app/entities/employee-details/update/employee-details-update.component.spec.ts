import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EmployeeDetailsService } from '../service/employee-details.service';
import { IEmployeeDetails, EmployeeDetails } from '../employee-details.model';

import { EmployeeDetailsUpdateComponent } from './employee-details-update.component';

describe('EmployeeDetails Management Update Component', () => {
  let comp: EmployeeDetailsUpdateComponent;
  let fixture: ComponentFixture<EmployeeDetailsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let employeeDetailsService: EmployeeDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EmployeeDetailsUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(EmployeeDetailsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EmployeeDetailsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    employeeDetailsService = TestBed.inject(EmployeeDetailsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const employeeDetails: IEmployeeDetails = { id: 'CBA' };

      activatedRoute.data = of({ employeeDetails });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(employeeDetails));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EmployeeDetails>>();
      const employeeDetails = { id: 'ABC' };
      jest.spyOn(employeeDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employeeDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: employeeDetails }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(employeeDetailsService.update).toHaveBeenCalledWith(employeeDetails);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EmployeeDetails>>();
      const employeeDetails = new EmployeeDetails();
      jest.spyOn(employeeDetailsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employeeDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: employeeDetails }));
      saveSubject.complete();

      // THEN
      expect(employeeDetailsService.create).toHaveBeenCalledWith(employeeDetails);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EmployeeDetails>>();
      const employeeDetails = { id: 'ABC' };
      jest.spyOn(employeeDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employeeDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(employeeDetailsService.update).toHaveBeenCalledWith(employeeDetails);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
