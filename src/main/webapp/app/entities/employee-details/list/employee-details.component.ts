import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmployeeDetails } from '../employee-details.model';
import { EmployeeDetailsService } from '../service/employee-details.service';
import { EmployeeDetailsDeleteDialogComponent } from '../delete/employee-details-delete-dialog.component';

@Component({
  selector: 'jhi-employee-details',
  templateUrl: './employee-details.component.html',
})
export class EmployeeDetailsComponent implements OnInit {
  employeeDetails?: IEmployeeDetails[];
  isLoading = false;

  constructor(protected employeeDetailsService: EmployeeDetailsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.employeeDetailsService.query().subscribe({
      next: (res: HttpResponse<IEmployeeDetails[]>) => {
        this.isLoading = false;
        this.employeeDetails = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IEmployeeDetails): string {
    return item.id!;
  }

  delete(employeeDetails: IEmployeeDetails): void {
    const modalRef = this.modalService.open(EmployeeDetailsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.employeeDetails = employeeDetails;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
