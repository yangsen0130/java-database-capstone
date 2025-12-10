package com.project.back_end.services;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Admin;
import com.project.back_end.models.Appointment;
import com.project.back_end.models.Doctor;
import com.project.back_end.models.Patient;
import com.project.back_end.repo.AdminRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@org.springframework.stereotype.Service
public class Service {

    private final TokenService tokenService;
    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DoctorService doctorService;
    private final PatientService patientService;

    public Service(TokenService tokenService, AdminRepository adminRepository,
                   DoctorRepository doctorRepository, PatientRepository patientRepository,
                   DoctorService doctorService, PatientService patientService) {
        this.tokenService = tokenService;
        this.adminRepository = adminRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.doctorService = doctorService;
        this.patientService = patientService;
    }

    public ResponseEntity<Map<String, String>> validateToken(String token, String user) {
        Map<String, String> response = new HashMap<>();
        if (tokenService.validateToken(token, user)) {
            // Logic dictates we return empty map on success based on Lab logic descriptions often seen
            // However, method signature implies returning a map. 
            // If invalid, we return error.
            return new ResponseEntity<>(response, HttpStatus.OK); 
        } else {
            response.put("message", "Invalid or Expired Token");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }

    public ResponseEntity<Map<String, String>> validateAdmin(Admin receivedAdmin) {
        Map<String, String> response = new HashMap<>();
        Admin admin = adminRepository.findByUsername(receivedAdmin.getUsername());

        if (admin != null && admin.getPassword().equals(receivedAdmin.getPassword())) {
            String token = tokenService.generateToken(admin.getUsername());
            response.put("token", token);
            response.put("message", "Login successful");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("message", "Invalid credentials");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }

    public Map<String, Object> filterDoctor(String name, String specialty, String time) {
        if (name != null && specialty != null && time != null) {
            return doctorService.filterDoctorsByNameSpecilityandTime(name, specialty, time);
        } else if (name != null && time != null) {
            return doctorService.filterDoctorByNameAndTime(name, time);
        } else if (name != null && specialty != null) {
            return doctorService.filterDoctorByNameAndSpecility(name, specialty);
        } else if (specialty != null && time != null) {
            return doctorService.filterDoctorByTimeAndSpecility(specialty, time);
        } else if (name != null) {
            return doctorService.findDoctorByName(name);
        } else if (specialty != null) {
            return doctorService.filterDoctorBySpecility(specialty);
        } else if (time != null) {
            return doctorService.filterDoctorsByTime(time);
        }
        // Default to returning all doctors if no filter provided
        Map<String, Object> response = new HashMap<>();
        response.put("doctors", doctorService.getDoctors());
        return response;
    }

    public int validateAppointment(Appointment appointment) {
        Doctor doctor = doctorRepository.findById(appointment.getDoctor().getId()).orElse(null);
        if (doctor == null) {
            return -1; // Doctor doesn't exist
        }

        // Get available slots for the doctor on the appointment date
        List<String> availableSlots = doctorService.getDoctorAvailability(
                doctor.getId(), 
                appointment.getAppointmentTime().toLocalDate()
        );

        // 获取请求的时间点字符串 (例如 "09:00")
        String requestedTime = appointment.getAppointmentTime().toLocalTime().toString();
        
        // 核心修复：检查可用时间段列表中，是否有任何一个时间段是以请求的时间点**开头**的
        // 例如：检查 "09:00-10:00" 是否以 "09:00" 开头 -> true
        boolean isSlotAvailable = availableSlots.stream()
                .anyMatch(slot -> slot.startsWith(requestedTime));

        if (isSlotAvailable) {
            return 1; // Valid
        } else {
            return 0; // Unavailable
        }
    }

    public boolean validatePatient(Patient patient) {
        Patient existing = patientRepository.findByEmailOrPhone(patient.getEmail(), patient.getPhone());
        return existing == null; // Returns true if patient does NOT exist (valid for creation)
    }

    public ResponseEntity<Map<String, String>> validatePatientLogin(Login login) {
        Map<String, String> response = new HashMap<>();
        Patient patient = patientRepository.findByEmail(login.getIdentifier());

        if (patient != null && patient.getPassword().equals(login.getPassword())) {
            String token = tokenService.generateToken(patient.getEmail());
            response.put("token", token);
            response.put("id", patient.getId().toString()); // Often helpful to return ID
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("message", "Invalid credentials");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }

    public ResponseEntity<Map<String, Object>> filterPatient(String condition, String name, String token) {
        // Extract patient email/id from token to ensure security in real app, 
        // but here we likely need the patient ID from context or passed parameters.
        // Assuming the TokenService can give us the email, we find the ID.
        String email = tokenService.extractIdentifier(token);
        Patient patient = patientRepository.findByEmail(email);
        
        if (patient == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        if (condition != null && name != null) {
            return patientService.filterByDoctorAndCondition(condition, name, patient.getId());
        } else if (name != null) {
            return patientService.filterByDoctor(name, patient.getId());
        } else if (condition != null) {
            return patientService.filterByCondition(condition, patient.getId());
        }
        
        // Default: Get all appointments
        return patientService.getPatientAppointment(patient.getId(), token);
    }
}