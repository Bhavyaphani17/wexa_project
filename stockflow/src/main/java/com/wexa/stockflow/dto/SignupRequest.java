
package com.wexa.stockflow.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(

        @NotBlank
        @Email
        String email,

        @NotBlank
        @Size(min = 8, message = "Password must contain at least 8 characters")
        String password,

        @NotBlank
        @Size(max = 100)
        String organizationName

) {}
