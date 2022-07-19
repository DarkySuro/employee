import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICandidate, Candidate } from '../candidate.model';

import { CandidateService } from './candidate.service';

describe('Candidate Service', () => {
  let service: CandidateService;
  let httpMock: HttpTestingController;
  let elemDefault: ICandidate;
  let expectedResult: ICandidate | ICandidate[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CandidateService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 'AAAAAAA',
      firstName: 'AAAAAAA',
      lastName: 'AAAAAAA',
      login: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Candidate', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Candidate()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Candidate', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          firstName: 'BBBBBB',
          lastName: 'BBBBBB',
          login: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Candidate', () => {
      const patchObject = Object.assign(
        {
          firstName: 'BBBBBB',
          login: 'BBBBBB',
        },
        new Candidate()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Candidate', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          firstName: 'BBBBBB',
          lastName: 'BBBBBB',
          login: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Candidate', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCandidateToCollectionIfMissing', () => {
      it('should add a Candidate to an empty array', () => {
        const candidate: ICandidate = { id: 'ABC' };
        expectedResult = service.addCandidateToCollectionIfMissing([], candidate);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(candidate);
      });

      it('should not add a Candidate to an array that contains it', () => {
        const candidate: ICandidate = { id: 'ABC' };
        const candidateCollection: ICandidate[] = [
          {
            ...candidate,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addCandidateToCollectionIfMissing(candidateCollection, candidate);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Candidate to an array that doesn't contain it", () => {
        const candidate: ICandidate = { id: 'ABC' };
        const candidateCollection: ICandidate[] = [{ id: 'CBA' }];
        expectedResult = service.addCandidateToCollectionIfMissing(candidateCollection, candidate);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(candidate);
      });

      it('should add only unique Candidate to an array', () => {
        const candidateArray: ICandidate[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '083480c4-67f7-42e4-a479-ec9f85655cfe' }];
        const candidateCollection: ICandidate[] = [{ id: 'ABC' }];
        expectedResult = service.addCandidateToCollectionIfMissing(candidateCollection, ...candidateArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const candidate: ICandidate = { id: 'ABC' };
        const candidate2: ICandidate = { id: 'CBA' };
        expectedResult = service.addCandidateToCollectionIfMissing([], candidate, candidate2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(candidate);
        expect(expectedResult).toContain(candidate2);
      });

      it('should accept null and undefined values', () => {
        const candidate: ICandidate = { id: 'ABC' };
        expectedResult = service.addCandidateToCollectionIfMissing([], null, candidate, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(candidate);
      });

      it('should return initial array if no Candidate is added', () => {
        const candidateCollection: ICandidate[] = [{ id: 'ABC' }];
        expectedResult = service.addCandidateToCollectionIfMissing(candidateCollection, undefined, null);
        expect(expectedResult).toEqual(candidateCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
