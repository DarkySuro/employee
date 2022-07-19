package com.datalinkedai.employee.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.datalinkedai.employee.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CandidateTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Candidate.class);
        Candidate candidate1 = new Candidate();
        candidate1.setId("id1");
        Candidate candidate2 = new Candidate();
        candidate2.setId(candidate1.getId());
        assertThat(candidate1).isEqualTo(candidate2);
        candidate2.setId("id2");
        assertThat(candidate1).isNotEqualTo(candidate2);
        candidate1.setId(null);
        assertThat(candidate1).isNotEqualTo(candidate2);
    }
}
