
package com.wexa.stockflow.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record ProductRequest(

        @NotBlank
        String name,

        @NotBlank
        String sku,

        String description,

        @NotNull
        @PositiveOrZero
        Integer quantity,

        @PositiveOrZero
        BigDecimal costPrice,

        @PositiveOrZero
        BigDecimal sellingPrice,

        @PositiveOrZero
        Integer lowStockThreshold

) {}
