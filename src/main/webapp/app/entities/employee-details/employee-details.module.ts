import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EmployeeDetailsComponent } from './list/employee-details.component';
import { EmployeeDetailsDetailComponent } from './detail/employee-details-detail.component';
import { EmployeeDetailsUpdateComponent } from './update/employee-details-update.component';
import { EmployeeDetailsDeleteDialogComponent } from './delete/employee-details-delete-dialog.component';
import { EmployeeDetailsRoutingModule } from './route/employee-details-routing.module';

@NgModule({
  imports: [SharedModule, EmployeeDetailsRoutingModule],
  declarations: [
    EmployeeDetailsComponent,
    EmployeeDetailsDetailComponent,
    EmployeeDetailsUpdateComponent,
    EmployeeDetailsDeleteDialogComponent,
  ],
  entryComponents: [EmployeeDetailsDeleteDialogComponent],
})
export class EmployeeDetailsModule {}
