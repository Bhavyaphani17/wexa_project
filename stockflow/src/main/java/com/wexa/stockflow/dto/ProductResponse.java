
package com.wexa.stockflow.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponse(
        Long id,
        String name,
        String sku,
        String description,
        Integer quantity,
        BigDecimal costPrice,
        BigDecimal sellingPrice,
        Integer lowStockThreshold,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
