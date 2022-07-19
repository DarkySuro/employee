import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CandidateService } from '../service/candidate.service';
import { ICandidate, Candidate } from '../candidate.model';
import { IEmployeeDetails } from 'app/entities/employee-details/employee-details.model';
import { EmployeeDetailsService } from 'app/entities/employee-details/service/employee-details.service';

import { CandidateUpdateComponent } from './candidate-update.component';

describe('Candidate Management Update Component', () => {
  let comp: CandidateUpdateComponent;
  let fixture: ComponentFixture<CandidateUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let candidateService: CandidateService;
  let employeeDetailsService: EmployeeDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CandidateUpdateComponent],
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
      .overrideTemplate(CandidateUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CandidateUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    candidateService = TestBed.inject(CandidateService);
    employeeDetailsService = TestBed.inject(EmployeeDetailsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call parent query and add missing value', () => {
      const candidate: ICandidate = { id: 'CBA' };
      const parent: IEmployeeDetails = { id: 'e7830b4b-a82b-46d7-a030-55e8f02a7ce5' };
      candidate.parent = parent;

      const parentCollection: IEmployeeDetails[] = [{ id: 'db2b3edd-4a9b-4139-9a81-d63fd4294aba' }];
      jest.spyOn(employeeDetailsService, 'query').mockReturnValue(of(new HttpResponse({ body: parentCollection })));
      const expectedCollection: IEmployeeDetails[] = [parent, ...parentCollection];
      jest.spyOn(employeeDetailsService, 'addEmployeeDetailsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ candidate });
      comp.ngOnInit();

      expect(employeeDetailsService.query).toHaveBeenCalled();
      expect(employeeDetailsService.addEmployeeDetailsToCollectionIfMissing).toHaveBeenCalledWith(parentCollection, parent);
      expect(comp.parentsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const candidate: ICandidate = { id: 'CBA' };
      const parent: IEmployeeDetails = { id: '45d192d3-4b46-40eb-aae7-23a4b4854a04' };
      candidate.parent = parent;

      activatedRoute.data = of({ candidate });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(candidate));
      expect(comp.parentsCollection).toContain(parent);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Candidate>>();
      const candidate = { id: 'ABC' };
      jest.spyOn(candidateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ candidate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: candidate }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(candidateService.update).toHaveBeenCalledWith(candidate);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Candidate>>();
      const candidate = new Candidate();
      jest.spyOn(candidateService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ candidate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: candidate }));
      saveSubject.complete();

      // THEN
      expect(candidateService.create).toHaveBeenCalledWith(candidate);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Candidate>>();
      const candidate = { id: 'ABC' };
      jest.spyOn(candidateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ candidate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(candidateService.update).toHaveBeenCalledWith(candidate);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackEmployeeDetailsById', () => {
      it('Should return tracked EmployeeDetails primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackEmployeeDetailsById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
