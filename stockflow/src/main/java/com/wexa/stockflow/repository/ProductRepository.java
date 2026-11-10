
package com.wexa.stockflow.repository;

import com.wexa.stockflow.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository
        extends JpaRepository<Product, Long> {

    List<Product> findAllByOrganization_Id(Long organizationId);

    Optional<Product> findByIdAndOrganization_Id(
            Long id, Long organizationId);

    boolean existsByOrganization_IdAndSku(
            Long organizationId, String sku);

    boolean existsByOrganization_IdAndSkuAndIdNot(
            Long organizationId, String sku, Long id);

    long countByOrganization_Id(Long organizationId);

    long countByOrganization_IdAndQuantityLessThanEqual(
            Long organizationId, Integer threshold);
}
