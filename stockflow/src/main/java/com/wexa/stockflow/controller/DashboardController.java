
package com.wexa.stockflow.controller;

import com.wexa.stockflow.dto.DashboardResponse;
import com.wexa.stockflow.entity.User;
import com.wexa.stockflow.service.DashboardService;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardResponse getDashboard(
            @AuthenticationPrincipal User user) {

        return dashboardService.getDashboard(user);
    }
}
