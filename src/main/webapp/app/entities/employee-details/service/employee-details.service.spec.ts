import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEmployeeDetails, EmployeeDetails } from '../employee-details.model';

import { EmployeeDetailsService } from './employee-details.service';

describe('EmployeeDetails Service', () => {
  let service: EmployeeDetailsService;
  let httpMock: HttpTestingController;
  let elemDefault: IEmployeeDetails;
  let expectedResult: IEmployeeDetails | IEmployeeDetails[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EmployeeDetailsService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 'AAAAAAA',
      aadharNumber: 'AAAAAAA',
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

    it('should create a EmployeeDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new EmployeeDetails()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EmployeeDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          aadharNumber: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EmployeeDetails', () => {
      const patchObject = Object.assign({}, new EmployeeDetails());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EmployeeDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          aadharNumber: 'BBBBBB',
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

    it('should delete a EmployeeDetails', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEmployeeDetailsToCollectionIfMissing', () => {
      it('should add a EmployeeDetails to an empty array', () => {
        const employeeDetails: IEmployeeDetails = { id: 'ABC' };
        expectedResult = service.addEmployeeDetailsToCollectionIfMissing([], employeeDetails);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(employeeDetails);
      });

      it('should not add a EmployeeDetails to an array that contains it', () => {
        const employeeDetails: IEmployeeDetails = { id: 'ABC' };
        const employeeDetailsCollection: IEmployeeDetails[] = [
          {
            ...employeeDetails,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addEmployeeDetailsToCollectionIfMissing(employeeDetailsCollection, employeeDetails);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EmployeeDetails to an array that doesn't contain it", () => {
        const employeeDetails: IEmployeeDetails = { id: 'ABC' };
        const employeeDetailsCollection: IEmployeeDetails[] = [{ id: 'CBA' }];
        expectedResult = service.addEmployeeDetailsToCollectionIfMissing(employeeDetailsCollection, employeeDetails);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(employeeDetails);
      });

      it('should add only unique EmployeeDetails to an array', () => {
        const employeeDetailsArray: IEmployeeDetails[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '53218052-629c-4616-a2be-9dd455428b3c' }];
        const employeeDetailsCollection: IEmployeeDetails[] = [{ id: 'ABC' }];
        expectedResult = service.addEmployeeDetailsToCollectionIfMissing(employeeDetailsCollection, ...employeeDetailsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const employeeDetails: IEmployeeDetails = { id: 'ABC' };
        const employeeDetails2: IEmployeeDetails = { id: 'CBA' };
        expectedResult = service.addEmployeeDetailsToCollectionIfMissing([], employeeDetails, employeeDetails2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(employeeDetails);
        expect(expectedResult).toContain(employeeDetails2);
      });

      it('should accept null and undefined values', () => {
        const employeeDetails: IEmployeeDetails = { id: 'ABC' };
        expectedResult = service.addEmployeeDetailsToCollectionIfMissing([], null, employeeDetails, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(employeeDetails);
      });

      it('should return initial array if no EmployeeDetails is added', () => {
        const employeeDetailsCollection: IEmployeeDetails[] = [{ id: 'ABC' }];
        expectedResult = service.addEmployeeDetailsToCollectionIfMissing(employeeDetailsCollection, undefined, null);
        expect(expectedResult).toEqual(employeeDetailsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
