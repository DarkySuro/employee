import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEmployeeDetails, EmployeeDetails } from '../employee-details.model';
import { EmployeeDetailsService } from '../service/employee-details.service';

@Injectable({ providedIn: 'root' })
export class EmployeeDetailsRoutingResolveService implements Resolve<IEmployeeDetails> {
  constructor(protected service: EmployeeDetailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmployeeDetails> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((employeeDetails: HttpResponse<EmployeeDetails>) => {
          if (employeeDetails.body) {
            return of(employeeDetails.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EmployeeDetails());
  }
}
