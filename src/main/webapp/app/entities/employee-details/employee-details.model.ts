import { ICandidate } from 'app/entities/candidate/candidate.model';

export interface IEmployeeDetails {
  id?: string;
  aadharNumber?: string;
  child?: ICandidate | null;
}

export class EmployeeDetails implements IEmployeeDetails {
  constructor(public id?: string, public aadharNumber?: string, public child?: ICandidate | null) {}
}

export function getEmployeeDetailsIdentifier(employeeDetails: IEmployeeDetails): string | undefined {
  return employeeDetails.id;
}
