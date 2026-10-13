package kz.smartexam.smartexam.controller;

import kz.smartexam.smartexam.dto.DashboardResponse;
import kz.smartexam.smartexam.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/teacher")
    public DashboardResponse getTeacherDashboard(){
        return dashboardService.getTeacherDashboard();
    }
}
