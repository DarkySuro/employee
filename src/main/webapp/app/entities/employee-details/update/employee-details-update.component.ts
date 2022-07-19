import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IEmployeeDetails, EmployeeDetails } from '../employee-details.model';
import { EmployeeDetailsService } from '../service/employee-details.service';

@Component({
  selector: 'jhi-employee-details-update',
  templateUrl: './employee-details-update.component.html',
})
export class EmployeeDetailsUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    aadharNumber: [null, [Validators.required, Validators.minLength(12)]],
  });

  constructor(
    protected employeeDetailsService: EmployeeDetailsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ employeeDetails }) => {
      this.updateForm(employeeDetails);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const employeeDetails = this.createFromForm();
    if (employeeDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.employeeDetailsService.update(employeeDetails));
    } else {
      this.subscribeToSaveResponse(this.employeeDetailsService.create(employeeDetails));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmployeeDetails>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(employeeDetails: IEmployeeDetails): void {
    this.editForm.patchValue({
      id: employeeDetails.id,
      aadharNumber: employeeDetails.aadharNumber,
    });
  }

  protected createFromForm(): IEmployeeDetails {
    return {
      ...new EmployeeDetails(),
      id: this.editForm.get(['id'])!.value,
      aadharNumber: this.editForm.get(['aadharNumber'])!.value,
    };
  }
}
