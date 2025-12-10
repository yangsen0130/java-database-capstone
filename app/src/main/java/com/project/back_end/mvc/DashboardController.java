package com.project.back_end.mvc; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.project.back_end.services.TokenService;

@Controller
public class DashboardController {

    @Autowired
    private TokenService tokenService;

    @GetMapping("/adminDashboard/{token}")
    public String showAdminDashboard(@PathVariable String token) {
        boolean isValid = tokenService.validateToken(token, "admin");

        if (isValid) {
            return "admin/adminDashboard";
        } else {
            return "redirect:/";
        }
    }

    @GetMapping("/doctorDashboard/{token}")
    public String showDoctorDashboard(@PathVariable String token) {
        // 修正：直接接收 boolean 结果
        boolean isValid = tokenService.validateToken(token, "doctor");

        if (isValid) {
            return "doctor/doctorDashboard";
        } else {
            return "redirect:/";
        }
    }
}