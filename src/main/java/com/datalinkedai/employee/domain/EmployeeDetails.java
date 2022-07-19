package com.datalinkedai.employee.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A EmployeeDetails.
 */
@Document(collection = "employee_details")
public class EmployeeDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull(message = "must not be null")
    @Size(min = 12)
    @Field("aadhar_number")
    private String aadharNumber;

    private Candidate child;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public EmployeeDetails id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAadharNumber() {
        return this.aadharNumber;
    }

    public EmployeeDetails aadharNumber(String aadharNumber) {
        this.setAadharNumber(aadharNumber);
        return this;
    }

    public void setAadharNumber(String aadharNumber) {
        this.aadharNumber = aadharNumber;
    }

    public Candidate getChild() {
        return this.child;
    }

    public void setChild(Candidate candidate) {
        if (this.child != null) {
            this.child.setParent(null);
        }
        if (candidate != null) {
            candidate.setParent(this);
        }
        this.child = candidate;
    }

    public EmployeeDetails child(Candidate candidate) {
        this.setChild(candidate);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EmployeeDetails)) {
            return false;
        }
        return id != null && id.equals(((EmployeeDetails) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EmployeeDetails{" +
            "id=" + getId() +
            ", aadharNumber='" + getAadharNumber() + "'" +
            "}";
    }
}
