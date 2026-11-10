
package com.wexa.stockflow.repository;

import com.wexa.stockflow.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository
        extends JpaRepository<Organization, Long> {
}
