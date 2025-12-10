package com.example.capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.project.back_end.services.TokenService;
import java.util.Map;

@Controller
public class DashboardController {

    // Autowire the service that handles token validation
    // Ensure 'TokenService' matches the class name you created in the previous lab
    @Autowired
    private TokenService tokenService;

    /**
     * Handles requests to the Admin Dashboard.
     * Validates if the token belongs to an admin.
     */
    @GetMapping("/adminDashboard/{token}")
    public String showAdminDashboard(@PathVariable String token) {
        // Validate token for "admin" role
        // The lab logic states: if the returned map is empty, the token is VALID.
        Map<String, String> validationResult = tokenService.validateToken(token, "admin");

        if (validationResult.isEmpty()) {
            // Token is valid, return the view name (resolves to templates/admin/adminDashboard.html)
            return "admin/adminDashboard";
        } else {
            // Token is invalid, redirect to login page (root URL)
            return "redirect:/";
        }
    }

    /**
     * Handles requests to the Doctor Dashboard.
     * Validates if the token belongs to a doctor.
     */
    @GetMapping("/doctorDashboard/{token}")
    public String showDoctorDashboard(@PathVariable String token) {
        // Validate token for "doctor" role
        Map<String, String> validationResult = tokenService.validateToken(token, "doctor");

        if (validationResult.isEmpty()) {
            // Token is valid, return the view name (resolves to templates/doctor/doctorDashboard.html)
            return "doctor/doctorDashboard";
        } else {
            // Token is invalid, redirect to login page (root URL)
            return "redirect:/";
        }
    }
}