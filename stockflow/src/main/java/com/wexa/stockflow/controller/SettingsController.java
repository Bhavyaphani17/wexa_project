
package com.wexa.stockflow.controller;

import com.wexa.stockflow.entity.User;
import com.wexa.stockflow.service.SettingsService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    public record SettingsRequest(
            @Min(value = 0, message = "Threshold cannot be negative")
            Integer defaultLowStockThreshold
    ) {}

    @GetMapping
    public SettingsRequest getSettings(
            @AuthenticationPrincipal User user) {
        return settingsService.getSettings(user);
    }

    @PutMapping
    public SettingsRequest updateSettings(
            @Valid @RequestBody SettingsRequest request,
            @AuthenticationPrincipal User user) {
        return settingsService.updateSettings(request, user);
    }
}
