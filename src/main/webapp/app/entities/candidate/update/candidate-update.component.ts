import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICandidate, Candidate } from '../candidate.model';
import { CandidateService } from '../service/candidate.service';
import { IEmployeeDetails } from 'app/entities/employee-details/employee-details.model';
import { EmployeeDetailsService } from 'app/entities/employee-details/service/employee-details.service';

@Component({
  selector: 'jhi-candidate-update',
  templateUrl: './candidate-update.component.html',
})
export class CandidateUpdateComponent implements OnInit {
  isSaving = false;

  parentsCollection: IEmployeeDetails[] = [];

  editForm = this.fb.group({
    id: [],
    firstName: [null, [Validators.required, Validators.maxLength(40)]],
    lastName: [null, [Validators.maxLength(60)]],
    login: [null, [Validators.minLength(1), Validators.maxLength(50)]],
    parent: [],
  });

  constructor(
    protected candidateService: CandidateService,
    protected employeeDetailsService: EmployeeDetailsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ candidate }) => {
      this.updateForm(candidate);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const candidate = this.createFromForm();
    if (candidate.id !== undefined) {
      this.subscribeToSaveResponse(this.candidateService.update(candidate));
    } else {
      this.subscribeToSaveResponse(this.candidateService.create(candidate));
    }
  }

  trackEmployeeDetailsById(_index: number, item: IEmployeeDetails): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICandidate>>): void {
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

  protected updateForm(candidate: ICandidate): void {
    this.editForm.patchValue({
      id: candidate.id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      login: candidate.login,
      parent: candidate.parent,
    });

    this.parentsCollection = this.employeeDetailsService.addEmployeeDetailsToCollectionIfMissing(this.parentsCollection, candidate.parent);
  }

  protected loadRelationshipsOptions(): void {
    this.employeeDetailsService
      .query({ filter: 'child-is-null' })
      .pipe(map((res: HttpResponse<IEmployeeDetails[]>) => res.body ?? []))
      .pipe(
        map((employeeDetails: IEmployeeDetails[]) =>
          this.employeeDetailsService.addEmployeeDetailsToCollectionIfMissing(employeeDetails, this.editForm.get('parent')!.value)
        )
      )
      .subscribe((employeeDetails: IEmployeeDetails[]) => (this.parentsCollection = employeeDetails));
  }

  protected createFromForm(): ICandidate {
    return {
      ...new Candidate(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      login: this.editForm.get(['login'])!.value,
      parent: this.editForm.get(['parent'])!.value,
    };
  }
}
