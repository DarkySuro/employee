package com.datalinkedai.employee.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.datalinkedai.employee.IntegrationTest;
import com.datalinkedai.employee.domain.EmployeeDetails;
import com.datalinkedai.employee.repository.EmployeeDetailsRepository;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link EmployeeDetailsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class EmployeeDetailsResourceIT {

    private static final String DEFAULT_AADHAR_NUMBER = "AAAAAAAAAAAA";
    private static final String UPDATED_AADHAR_NUMBER = "BBBBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/employee-details";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private EmployeeDetailsRepository employeeDetailsRepository;

    @Autowired
    private WebTestClient webTestClient;

    private EmployeeDetails employeeDetails;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EmployeeDetails createEntity() {
        EmployeeDetails employeeDetails = new EmployeeDetails().aadharNumber(DEFAULT_AADHAR_NUMBER);
        return employeeDetails;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EmployeeDetails createUpdatedEntity() {
        EmployeeDetails employeeDetails = new EmployeeDetails().aadharNumber(UPDATED_AADHAR_NUMBER);
        return employeeDetails;
    }

    @BeforeEach
    public void initTest() {
        employeeDetailsRepository.deleteAll().block();
        employeeDetails = createEntity();
    }

    @Test
    void createEmployeeDetails() throws Exception {
        int databaseSizeBeforeCreate = employeeDetailsRepository.findAll().collectList().block().size();
        // Create the EmployeeDetails
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(employeeDetails))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the EmployeeDetails in the database
        List<EmployeeDetails> employeeDetailsList = employeeDetailsRepository.findAll().collectList().block();
        assertThat(employeeDetailsList).hasSize(databaseSizeBeforeCreate + 1);
        EmployeeDetails testEmployeeDetails = employeeDetailsList.get(employeeDetailsList.size() - 1);
        assertThat(testEmployeeDetails.getAadharNumber()).isEqualTo(DEFAULT_AADHAR_NUMBER);
    }

    @Test
    void createEmployeeDetailsWithExistingId() throws Exception {
        // Create the EmployeeDetails with an existing ID
        employeeDetails.setId("existing_id");

        int databaseSizeBeforeCreate = employeeDetailsRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(employeeDetails))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the EmployeeDetails in the database
        List<EmployeeDetails> employeeDetailsList = employeeDetailsRepository.findAll().collectList().block();
        assertThat(employeeDetailsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkAadharNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = employeeDetailsRepository.findAll().collectList().block().size();
        // set the field null
        employeeDetails.setAadharNumber(null);

        // Create the EmployeeDetails, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(employeeDetails))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<EmployeeDetails> employeeDetailsList = employeeDetailsRepository.findAll().collectList().block();
        assertThat(employeeDetailsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllEmployeeDetailsAsStream() {
        // Initialize the database
        employeeDetailsRepository.save(employeeDetails).block();

        List<EmployeeDetails> employeeDetailsList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(EmployeeDetails.class)
            .getResponseBody()
            .filter(employeeDetails::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(employeeDetailsList).isNotNull();
        assertThat(employeeDetailsList).hasSize(1);
        EmployeeDetails testEmployeeDetails = employeeDetailsList.get(0);
        assertThat(testEmployeeDetails.getAadharNumber()).isEqualTo(DEFAULT_AADHAR_NUMBER);
    }

    @Test
    void getAllEmployeeDetails() {
        // Initialize the database
        employeeDetailsRepository.save(employeeDetails).block();

        // Get all the employeeDetailsList
        webTestClient
            .get()
            .uri(ENTITY_API_URL + "?sort=id,desc")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.[*].id")
            .value(hasItem(employeeDetails.getId()))
            .jsonPath("$.[*].aadharNumber")
            .value(hasItem(DEFAULT_AADHAR_NUMBER));
    }

    @Test
    void getEmployeeDetails() {
        // Initialize the database
        employeeDetailsRepository.save(employeeDetails).block();

        // Get the employeeDetails
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, employeeDetails.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(employeeDetails.getId()))
            .jsonPath("$.aadharNumber")
            .value(is(DEFAULT_AADHAR_NUMBER));
    }

    @Test
    void getNonExistingEmployeeDetails() {
        // Get the employeeDetails
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewEmployeeDetails() throws Exception {
        // Initialize the database
        employeeDetailsRepository.save(employeeDetails).block();

        int databaseSizeBeforeUpdate = employeeDetailsRepository.findAll().collectList().block().size();

        // Update the employeeDetails
        EmployeeDetails updatedEmployeeDetails = employeeDetailsRepository.findById(employeeDetails.getId()).block();
        updatedEmployeeDetails.aadharNumber(UPDATED_AADHAR_NUMBER);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedEmployeeDetails.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedEmployeeDetails))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the EmployeeDetails in the database
        List<EmployeeDetails> employeeDetailsList = employeeDetailsRepository.findAll().collectList().block();
        assertThat(employeeDetailsList).hasSize(databaseSizeBeforeUpdate);
        EmployeeDetails testEmployeeDetails = employeeDetailsList.get(employeeDetailsList.size() - 1);
        assertThat(testEmployeeDetails.getAadharNumber()).isEqualTo(UPDATED_AADHAR_NUMBER);
    }

    @Test
    void putNonExistingEmployeeDetails() throws Exception {
        int databaseSizeBeforeUpdate = employeeDetailsRepository.findAll().collectList().block().size();
        employeeDetails.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, employeeDetails.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(employeeDetails))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the EmployeeDetails in the database
        List<EmployeeDetails> employeeDetailsList = employeeDetailsRepository.findAll().collectList().block();
        assertThat(employeeDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchEmployeeDetails() throws Exception {
        int databaseSizeBeforeUpdate = employeeDetailsRepository.findAll().collectList().block().size();
        employeeDetails.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(employeeDetails))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the EmployeeDetails in the database
        List<EmployeeDetails> employeeDetailsList = employeeDetailsRepository.findAll().collectList().block();
        assertThat(employeeDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamEmployeeDetails() throws Exception {
        int databaseSizeBeforeUpdate = employeeDetailsRepository.findAll().collectList().block().size();
        employeeDetails.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(employeeDetails))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the EmployeeDetails in the database
        List<EmployeeDetails> employeeDetailsList = employeeDetailsRepository.findAll().collectList().block();
        assertThat(employeeDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateEmployeeDetailsWithPatch() throws Exception {
        // Initialize the database
        employeeDetailsRepository.save(employeeDetails).block();

        int databaseSizeBeforeUpdate = employeeDetailsRepository.findAll().collectList().block().size();

        // Update the employeeDetails using partial update
        EmployeeDetails partialUpdatedEmployeeDetails = new EmployeeDetails();
        partialUpdatedEmployeeDetails.setId(employeeDetails.getId());

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedEmployeeDetails.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedEmployeeDetails))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the EmployeeDetails in the database
        List<EmployeeDetails> employeeDetailsList = employeeDetailsRepository.findAll().collectList().block();
        assertThat(employeeDetailsList).hasSize(databaseSizeBeforeUpdate);
        EmployeeDetails testEmployeeDetails = employeeDetailsList.get(employeeDetailsList.size() - 1);
        assertThat(testEmployeeDetails.getAadharNumber()).isEqualTo(DEFAULT_AADHAR_NUMBER);
    }

    @Test
    void fullUpdateEmployeeDetailsWithPatch() throws Exception {
        // Initialize the database
        employeeDetailsRepository.save(employeeDetails).block();

        int databaseSizeBeforeUpdate = employeeDetailsRepository.findAll().collectList().block().size();

        // Update the employeeDetails using partial update
        EmployeeDetails partialUpdatedEmployeeDetails = new EmployeeDetails();
        partialUpdatedEmployeeDetails.setId(employeeDetails.getId());

        partialUpdatedEmployeeDetails.aadharNumber(UPDATED_AADHAR_NUMBER);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedEmployeeDetails.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedEmployeeDetails))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the EmployeeDetails in the database
        List<EmployeeDetails> employeeDetailsList = employeeDetailsRepository.findAll().collectList().block();
        assertThat(employeeDetailsList).hasSize(databaseSizeBeforeUpdate);
        EmployeeDetails testEmployeeDetails = employeeDetailsList.get(employeeDetailsList.size() - 1);
        assertThat(testEmployeeDetails.getAadharNumber()).isEqualTo(UPDATED_AADHAR_NUMBER);
    }

    @Test
    void patchNonExistingEmployeeDetails() throws Exception {
        int databaseSizeBeforeUpdate = employeeDetailsRepository.findAll().collectList().block().size();
        employeeDetails.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, employeeDetails.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(employeeDetails))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the EmployeeDetails in the database
        List<EmployeeDetails> employeeDetailsList = employeeDetailsRepository.findAll().collectList().block();
        assertThat(employeeDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchEmployeeDetails() throws Exception {
        int databaseSizeBeforeUpdate = employeeDetailsRepository.findAll().collectList().block().size();
        employeeDetails.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(employeeDetails))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the EmployeeDetails in the database
        List<EmployeeDetails> employeeDetailsList = employeeDetailsRepository.findAll().collectList().block();
        assertThat(employeeDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamEmployeeDetails() throws Exception {
        int databaseSizeBeforeUpdate = employeeDetailsRepository.findAll().collectList().block().size();
        employeeDetails.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(employeeDetails))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the EmployeeDetails in the database
        List<EmployeeDetails> employeeDetailsList = employeeDetailsRepository.findAll().collectList().block();
        assertThat(employeeDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteEmployeeDetails() {
        // Initialize the database
        employeeDetailsRepository.save(employeeDetails).block();

        int databaseSizeBeforeDelete = employeeDetailsRepository.findAll().collectList().block().size();

        // Delete the employeeDetails
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, employeeDetails.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<EmployeeDetails> employeeDetailsList = employeeDetailsRepository.findAll().collectList().block();
        assertThat(employeeDetailsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
