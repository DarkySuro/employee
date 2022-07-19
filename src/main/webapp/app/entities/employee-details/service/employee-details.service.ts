import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEmployeeDetails, getEmployeeDetailsIdentifier } from '../employee-details.model';

export type EntityResponseType = HttpResponse<IEmployeeDetails>;
export type EntityArrayResponseType = HttpResponse<IEmployeeDetails[]>;

@Injectable({ providedIn: 'root' })
export class EmployeeDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/employee-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(employeeDetails: IEmployeeDetails): Observable<EntityResponseType> {
    return this.http.post<IEmployeeDetails>(this.resourceUrl, employeeDetails, { observe: 'response' });
  }

  update(employeeDetails: IEmployeeDetails): Observable<EntityResponseType> {
    return this.http.put<IEmployeeDetails>(
      `${this.resourceUrl}/${getEmployeeDetailsIdentifier(employeeDetails) as string}`,
      employeeDetails,
      { observe: 'response' }
    );
  }

  partialUpdate(employeeDetails: IEmployeeDetails): Observable<EntityResponseType> {
    return this.http.patch<IEmployeeDetails>(
      `${this.resourceUrl}/${getEmployeeDetailsIdentifier(employeeDetails) as string}`,
      employeeDetails,
      { observe: 'response' }
    );
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IEmployeeDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEmployeeDetails[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEmployeeDetailsToCollectionIfMissing(
    employeeDetailsCollection: IEmployeeDetails[],
    ...employeeDetailsToCheck: (IEmployeeDetails | null | undefined)[]
  ): IEmployeeDetails[] {
    const employeeDetails: IEmployeeDetails[] = employeeDetailsToCheck.filter(isPresent);
    if (employeeDetails.length > 0) {
      const employeeDetailsCollectionIdentifiers = employeeDetailsCollection.map(
        employeeDetailsItem => getEmployeeDetailsIdentifier(employeeDetailsItem)!
      );
      const employeeDetailsToAdd = employeeDetails.filter(employeeDetailsItem => {
        const employeeDetailsIdentifier = getEmployeeDetailsIdentifier(employeeDetailsItem);
        if (employeeDetailsIdentifier == null || employeeDetailsCollectionIdentifiers.includes(employeeDetailsIdentifier)) {
          return false;
        }
        employeeDetailsCollectionIdentifiers.push(employeeDetailsIdentifier);
        return true;
      });
      return [...employeeDetailsToAdd, ...employeeDetailsCollection];
    }
    return employeeDetailsCollection;
  }
}
