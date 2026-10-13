package kz.smartexam.smartexam.controller;

import jakarta.validation.Valid;
import kz.smartexam.smartexam.dto.AdminDashboardResponse;
import kz.smartexam.smartexam.dto.CreateTeacherRequest;
import kz.smartexam.smartexam.dto.TeacherResponse;
import kz.smartexam.smartexam.service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/teachers")
    public TeacherResponse createTeacher(
            @Valid @RequestBody CreateTeacherRequest request) {

        return adminService.createTeacher(request);
    }

    @GetMapping("/teachers")
    public List<TeacherResponse> getAllTeachers() {
        return adminService.getAllTeachers();
    }

    @GetMapping("/dashboard")
    public AdminDashboardResponse getDashboard() {
        return adminService.getDashboard();
    }
}