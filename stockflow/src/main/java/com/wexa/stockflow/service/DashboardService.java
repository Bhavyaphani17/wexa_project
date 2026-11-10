
package com.wexa.stockflow.service;

import com.wexa.stockflow.dto.DashboardResponse;
import com.wexa.stockflow.entity.Product;
import com.wexa.stockflow.entity.User;
import com.wexa.stockflow.repository.ProductRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DashboardService {

    private final ProductRepository productRepository;

    public DashboardService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(User user) {

        Long organizationId = user.getOrganization().getId();

        List<Product> products =
                productRepository.findAllByOrganization_Id(organizationId);

        long totalProducts = products.size();

        long totalStock = products.stream()
                .mapToLong(Product::getQuantity)
                .sum();

        long lowStockProducts = products.stream()
                .filter(product -> {
                    Integer threshold = product.getLowStockThreshold();

                    if (threshold == null) {
                        threshold = user.getOrganization()
                                .getDefaultLowStockThreshold();
                    }

                    return product.getQuantity() <= threshold;
                })
                .count();

        BigDecimal inventoryValue = products.stream()
                .map(product -> {
                    BigDecimal sellingPrice = product.getSellingPrice() != null
                            ? product.getSellingPrice()
                            : BigDecimal.ZERO;

                    return sellingPrice.multiply(
                            BigDecimal.valueOf(product.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new DashboardResponse(
                totalProducts,
                totalStock,
                lowStockProducts,
                inventoryValue
        );
    }
}
