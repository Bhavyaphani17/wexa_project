
package com.wexa.stockflow.dto;

import java.math.BigDecimal;

public record DashboardResponse(
        long totalProducts,
        long totalStock,
        long lowStockProducts,
        BigDecimal inventoryValue
) {}
