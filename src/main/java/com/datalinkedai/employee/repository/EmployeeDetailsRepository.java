package com.datalinkedai.employee.repository;

import com.datalinkedai.employee.domain.EmployeeDetails;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB reactive repository for the EmployeeDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmployeeDetailsRepository extends ReactiveMongoRepository<EmployeeDetails, String> {}
