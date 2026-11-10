
package com.wexa.stockflow.service;

import com.wexa.stockflow.controller.SettingsController.SettingsRequest;
import com.wexa.stockflow.entity.User;
import com.wexa.stockflow.repository.OrganizationRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SettingsService {

    private final OrganizationRepository organizationRepository;

    public SettingsService(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    @Transactional(readOnly = true)
    public SettingsRequest getSettings(User user) {
        var organization = organizationRepository
                .findById(user.getOrganization().getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Organization not found"));

        return new SettingsRequest(
                organization.getDefaultLowStockThreshold());
    }

    @Transactional
    public SettingsRequest updateSettings(SettingsRequest request, User user) {
        if (request.defaultLowStockThreshold() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Threshold is required");
        }

        var organization = organizationRepository
                .findById(user.getOrganization().getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Organization not found"));

        organization.setDefaultLowStockThreshold(
                request.defaultLowStockThreshold());

        organizationRepository.save(organization);

        return new SettingsRequest(
                organization.getDefaultLowStockThreshold());
    }
}
