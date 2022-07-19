package com.datalinkedai.employee.web.rest;

import com.datalinkedai.employee.domain.EmployeeDetails;
import com.datalinkedai.employee.repository.EmployeeDetailsRepository;
import com.datalinkedai.employee.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.reactive.ResponseUtil;

/**
 * REST controller for managing {@link com.datalinkedai.employee.domain.EmployeeDetails}.
 */
@RestController
@RequestMapping("/api")
public class EmployeeDetailsResource {

    private final Logger log = LoggerFactory.getLogger(EmployeeDetailsResource.class);

    private static final String ENTITY_NAME = "employeeDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EmployeeDetailsRepository employeeDetailsRepository;

    public EmployeeDetailsResource(EmployeeDetailsRepository employeeDetailsRepository) {
        this.employeeDetailsRepository = employeeDetailsRepository;
    }

    /**
     * {@code POST  /employee-details} : Create a new employeeDetails.
     *
     * @param employeeDetails the employeeDetails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new employeeDetails, or with status {@code 400 (Bad Request)} if the employeeDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/employee-details")
    public Mono<ResponseEntity<EmployeeDetails>> createEmployeeDetails(@Valid @RequestBody EmployeeDetails employeeDetails)
        throws URISyntaxException {
        log.debug("REST request to save EmployeeDetails : {}", employeeDetails);
        if (employeeDetails.getId() != null) {
            throw new BadRequestAlertException("A new employeeDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return employeeDetailsRepository
            .save(employeeDetails)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/employee-details/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /employee-details/:id} : Updates an existing employeeDetails.
     *
     * @param id the id of the employeeDetails to save.
     * @param employeeDetails the employeeDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated employeeDetails,
     * or with status {@code 400 (Bad Request)} if the employeeDetails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the employeeDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/employee-details/{id}")
    public Mono<ResponseEntity<EmployeeDetails>> updateEmployeeDetails(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody EmployeeDetails employeeDetails
    ) throws URISyntaxException {
        log.debug("REST request to update EmployeeDetails : {}, {}", id, employeeDetails);
        if (employeeDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, employeeDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return employeeDetailsRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return employeeDetailsRepository
                    .save(employeeDetails)
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(result ->
                        ResponseEntity
                            .ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId()))
                            .body(result)
                    );
            });
    }

    /**
     * {@code PATCH  /employee-details/:id} : Partial updates given fields of an existing employeeDetails, field will ignore if it is null
     *
     * @param id the id of the employeeDetails to save.
     * @param employeeDetails the employeeDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated employeeDetails,
     * or with status {@code 400 (Bad Request)} if the employeeDetails is not valid,
     * or with status {@code 404 (Not Found)} if the employeeDetails is not found,
     * or with status {@code 500 (Internal Server Error)} if the employeeDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/employee-details/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<EmployeeDetails>> partialUpdateEmployeeDetails(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody EmployeeDetails employeeDetails
    ) throws URISyntaxException {
        log.debug("REST request to partial update EmployeeDetails partially : {}, {}", id, employeeDetails);
        if (employeeDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, employeeDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return employeeDetailsRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<EmployeeDetails> result = employeeDetailsRepository
                    .findById(employeeDetails.getId())
                    .map(existingEmployeeDetails -> {
                        if (employeeDetails.getAadharNumber() != null) {
                            existingEmployeeDetails.setAadharNumber(employeeDetails.getAadharNumber());
                        }

                        return existingEmployeeDetails;
                    })
                    .flatMap(employeeDetailsRepository::save);

                return result
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(res ->
                        ResponseEntity
                            .ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, res.getId()))
                            .body(res)
                    );
            });
    }

    /**
     * {@code GET  /employee-details} : get all the employeeDetails.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of employeeDetails in body.
     */
    @GetMapping("/employee-details")
    public Mono<List<EmployeeDetails>> getAllEmployeeDetails(@RequestParam(required = false) String filter) {
        if ("child-is-null".equals(filter)) {
            log.debug("REST request to get all EmployeeDetailss where child is null");
            return (Mono<List<EmployeeDetails>>) StreamSupport
                .stream(((List<EmployeeDetails>) employeeDetailsRepository.findAll()).spliterator(), false)
                .filter(employeeDetails -> employeeDetails.getChild() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all EmployeeDetails");
        return employeeDetailsRepository.findAll().collectList();
    }

    /**
     * {@code GET  /employee-details} : get all the employeeDetails as a stream.
     * @return the {@link Flux} of employeeDetails.
     */
    @GetMapping(value = "/employee-details", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<EmployeeDetails> getAllEmployeeDetailsAsStream() {
        log.debug("REST request to get all EmployeeDetails as a stream");
        return employeeDetailsRepository.findAll();
    }

    /**
     * {@code GET  /employee-details/:id} : get the "id" employeeDetails.
     *
     * @param id the id of the employeeDetails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the employeeDetails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/employee-details/{id}")
    public Mono<ResponseEntity<EmployeeDetails>> getEmployeeDetails(@PathVariable String id) {
        log.debug("REST request to get EmployeeDetails : {}", id);
        Mono<EmployeeDetails> employeeDetails = employeeDetailsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(employeeDetails);
    }

    /**
     * {@code DELETE  /employee-details/:id} : delete the "id" employeeDetails.
     *
     * @param id the id of the employeeDetails to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/employee-details/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public Mono<ResponseEntity<Void>> deleteEmployeeDetails(@PathVariable String id) {
        log.debug("REST request to delete EmployeeDetails : {}", id);
        return employeeDetailsRepository
            .deleteById(id)
            .map(result ->
                ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build()
            );
    }
}
