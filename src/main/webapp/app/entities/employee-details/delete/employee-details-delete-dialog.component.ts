import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmployeeDetails } from '../employee-details.model';
import { EmployeeDetailsService } from '../service/employee-details.service';

@Component({
  templateUrl: './employee-details-delete-dialog.component.html',
})
export class EmployeeDetailsDeleteDialogComponent {
  employeeDetails?: IEmployeeDetails;

  constructor(protected employeeDetailsService: EmployeeDetailsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.employeeDetailsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
