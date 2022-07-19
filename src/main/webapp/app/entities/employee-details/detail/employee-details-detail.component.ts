import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmployeeDetails } from '../employee-details.model';

@Component({
  selector: 'jhi-employee-details-detail',
  templateUrl: './employee-details-detail.component.html',
})
export class EmployeeDetailsDetailComponent implements OnInit {
  employeeDetails: IEmployeeDetails | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ employeeDetails }) => {
      this.employeeDetails = employeeDetails;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
