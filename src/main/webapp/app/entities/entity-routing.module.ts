import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'candidate',
        data: { pageTitle: 'employeeApp.candidate.home.title' },
        loadChildren: () => import('./candidate/candidate.module').then(m => m.CandidateModule),
      },
      {
        path: 'employee-details',
        data: { pageTitle: 'employeeApp.employeeDetails.home.title' },
        loadChildren: () => import('./employee-details/employee-details.module').then(m => m.EmployeeDetailsModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
