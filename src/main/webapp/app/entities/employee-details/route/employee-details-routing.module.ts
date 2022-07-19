import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EmployeeDetailsComponent } from '../list/employee-details.component';
import { EmployeeDetailsDetailComponent } from '../detail/employee-details-detail.component';
import { EmployeeDetailsUpdateComponent } from '../update/employee-details-update.component';
import { EmployeeDetailsRoutingResolveService } from './employee-details-routing-resolve.service';

const employeeDetailsRoute: Routes = [
  {
    path: '',
    component: EmployeeDetailsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EmployeeDetailsDetailComponent,
    resolve: {
      employeeDetails: EmployeeDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EmployeeDetailsUpdateComponent,
    resolve: {
      employeeDetails: EmployeeDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EmployeeDetailsUpdateComponent,
    resolve: {
      employeeDetails: EmployeeDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(employeeDetailsRoute)],
  exports: [RouterModule],
})
export class EmployeeDetailsRoutingModule {}
