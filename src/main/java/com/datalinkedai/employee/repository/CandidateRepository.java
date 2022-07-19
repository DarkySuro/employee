package com.datalinkedai.employee.repository;

import com.datalinkedai.employee.domain.Candidate;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB reactive repository for the Candidate entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CandidateRepository extends ReactiveMongoRepository<Candidate, String> {}
