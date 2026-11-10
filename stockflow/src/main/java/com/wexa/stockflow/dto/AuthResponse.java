
package com.wexa.stockflow.dto;

public record AuthResponse(
        String token,
        String email,
        String organizationName
) {}
