import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IEmployeeDetails, EmployeeDetails } from '../employee-details.model';
import { EmployeeDetailsService } from '../service/employee-details.service';

import { EmployeeDetailsRoutingResolveService } from './employee-details-routing-resolve.service';

describe('EmployeeDetails routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: EmployeeDetailsRoutingResolveService;
  let service: EmployeeDetailsService;
  let resultEmployeeDetails: IEmployeeDetails | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(EmployeeDetailsRoutingResolveService);
    service = TestBed.inject(EmployeeDetailsService);
    resultEmployeeDetails = undefined;
  });

  describe('resolve', () => {
    it('should return IEmployeeDetails returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEmployeeDetails = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultEmployeeDetails).toEqual({ id: 'ABC' });
    });

    it('should return new IEmployeeDetails if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEmployeeDetails = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultEmployeeDetails).toEqual(new EmployeeDetails());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as EmployeeDetails })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEmployeeDetails = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultEmployeeDetails).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
