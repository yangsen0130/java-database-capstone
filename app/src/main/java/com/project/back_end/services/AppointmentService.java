package com.project.back_end.services;

import com.project.back_end.DTO.AppointmentDTO;
import com.project.back_end.models.Appointment;
import com.project.back_end.models.Doctor;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final TokenService tokenService;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              PatientRepository patientRepository,
                              DoctorRepository doctorRepository,
                              TokenService tokenService) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.tokenService = tokenService;
    }

    public int bookAppointment(Appointment appointment) {
        try {
            appointmentRepository.save(appointment);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    public ResponseEntity<Map<String, String>> updateAppointment(Appointment appointment) {
        Map<String, String> response = new HashMap<>();
        // Check if the appointment exists before updating
        if (appointmentRepository.existsById(appointment.getId())) {
            appointmentRepository.save(appointment);
            response.put("message", "Appointment updated");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("message", "Appointment not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Map<String, String>> cancelAppointment(Long id, String token) {
        Map<String, String> response = new HashMap<>();
        Appointment appointment = appointmentRepository.findById(id).orElse(null);

        if (appointment != null) {
            // Verify that the patient canceling is the one who booked it
            String patientEmail = tokenService.extractIdentifier(token);
            if (appointment.getPatient().getEmail().equals(patientEmail)) {
                appointmentRepository.delete(appointment);
                response.put("message", "Appointment cancelled");
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                response.put("message", "Unauthorized to cancel this appointment");
                return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
            }
        } else {
            response.put("message", "Appointment not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getAppointment(String pname, LocalDate date, String token) {
        Map<String, Object> response = new HashMap<>();
        
        String doctorEmail = tokenService.extractIdentifier(token);
        Doctor doctor = doctorRepository.findByEmail(doctorEmail);

        if (doctor == null) {
            response.put("message", "Doctor not found");
            return response;
        }

        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(LocalTime.MAX);
        List<Appointment> appointments;

        // 核心修复：增加 !pname.equals("null") 判断
        // 防止将默认参数 "null" 当作名字去数据库搜索
        if (pname != null && !pname.isEmpty() && !pname.equals("null")) {
            appointments = appointmentRepository.findByDoctorIdAndPatient_NameContainingIgnoreCaseAndAppointmentTimeBetween(
                    doctor.getId(), pname, start, end);
        } else {
            appointments = appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(
                    doctor.getId(), start, end);
        }

        // Convert to DTOs
        List<AppointmentDTO> dtos = appointments.stream()
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());

        response.put("appointments", dtos);
        return response;
    }
}