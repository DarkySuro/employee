import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EmployeeDetailsService } from '../service/employee-details.service';

import { EmployeeDetailsComponent } from './employee-details.component';

describe('EmployeeDetails Management Component', () => {
  let comp: EmployeeDetailsComponent;
  let fixture: ComponentFixture<EmployeeDetailsComponent>;
  let service: EmployeeDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EmployeeDetailsComponent],
    })
      .overrideTemplate(EmployeeDetailsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EmployeeDetailsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EmployeeDetailsService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 'ABC' }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.employeeDetails?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });
});
