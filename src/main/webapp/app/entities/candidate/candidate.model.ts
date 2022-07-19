import { IEmployeeDetails } from 'app/entities/employee-details/employee-details.model';

export interface ICandidate {
  id?: string;
  firstName?: string;
  lastName?: string | null;
  login?: string | null;
  parent?: IEmployeeDetails | null;
}

export class Candidate implements ICandidate {
  constructor(
    public id?: string,
    public firstName?: string,
    public lastName?: string | null,
    public login?: string | null,
    public parent?: IEmployeeDetails | null
  ) {}
}

export function getCandidateIdentifier(candidate: ICandidate): string | undefined {
  return candidate.id;
}
