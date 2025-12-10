package com.project.back_end.services;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Appointment;
import com.project.back_end.models.Doctor;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.DoctorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final TokenService tokenService;

    public DoctorService(DoctorRepository doctorRepository, AppointmentRepository appointmentRepository, TokenService tokenService) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.tokenService = tokenService;
    }

    @Transactional(readOnly = true)
    public List<String> getDoctorAvailability(Long doctorId, LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId).orElse(null);
        if (doctor == null) return new ArrayList<>();

        List<String> allSlots = doctor.getAvailableTimes();
        if (allSlots == null) return new ArrayList<>();

        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(doctorId, startOfDay, endOfDay);

        List<String> bookedTimes = appointments.stream()
                .map(a -> a.getAppointmentTime().toLocalTime().toString())
                .collect(Collectors.toList());

        return allSlots.stream()
                .filter(slot -> {
                    return bookedTimes.stream().noneMatch(bookedTime -> slot.startsWith(bookedTime));
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public int saveDoctor(Doctor doctor) {
        if (doctorRepository.findByEmail(doctor.getEmail()) != null) {
            return -1; 
        }
        doctorRepository.save(doctor);
        return 1; 
    }

    @Transactional
    public int updateDoctor(Doctor doctor) {
        try {
            if (!doctorRepository.existsById(doctor.getId())) {
                return -1; 
            }
            doctorRepository.save(doctor);
            return 1; 
        } catch (Exception e) {
            return 0; 
        }
    }

    @Transactional(readOnly = true)
    public List<Doctor> getDoctors() {
        return doctorRepository.findAll();
    }

    @Transactional
    public int deleteDoctor(Long id) {
        try {
            if (!doctorRepository.existsById(id)) {
                return -1; 
            }
            appointmentRepository.deleteAllByDoctorId(id);
            doctorRepository.deleteById(id);
            return 1; 
        } catch (Exception e) {
            return 0; 
        }
    }

    public ResponseEntity<Map<String, String>> validateDoctor(Login login) {
        Map<String, String> response = new HashMap<>();
        Doctor doctor = doctorRepository.findByEmail(login.getIdentifier());

        if (doctor != null && doctor.getPassword().equals(login.getPassword())) {
            String token = tokenService.generateToken(doctor.getEmail());
            response.put("token", token);
            response.put("message", "Login successful");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("message", "Invalid credentials");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }

    @Transactional(readOnly = true)
    public Map<String, Object> findDoctorByName(String name) {
        List<Doctor> doctors = doctorRepository.findByNameLike(name);
        Map<String, Object> response = new HashMap<>();
        response.put("doctors", doctors);
        return response;
    }

    // ==========================================
    // 核心修复区域：过滤逻辑
    // ==========================================

    /**
     * 判断某个时间段是否属于 AM 或 PM
     * @param slot 数据库中的时间段，例如 "09:00-10:00"
     * @param amOrPm "AM" 或 "PM"
     */
    private boolean isTimeInAmPm(String slot, String amOrPm) {
        try {
            // 修复点：先拆分字符串，取开始时间 "09:00" 进行解析
            String startTime = slot.split("-")[0];
            LocalTime localTime = LocalTime.parse(startTime);
            
            if ("AM".equalsIgnoreCase(amOrPm)) {
                return localTime.getHour() < 12;
            } else if ("PM".equalsIgnoreCase(amOrPm)) {
                return localTime.getHour() >= 12;
            }
        } catch (Exception e) {
            // 解析失败（比如数据格式不对）时不报错，直接返回不匹配
            return false;
        }
        return false;
    }

    /**
     * 统一的时间过滤入口
     */
    private List<Doctor> filterDoctorByTimeHelper(List<Doctor> doctors, String timeFilter) {
        List<Doctor> filteredDoctors = new ArrayList<>();
        for (Doctor doc : doctors) {
            if (doc.getAvailableTimes() != null) {
                boolean match = false;
                
                // 情况1：如果是 AM/PM 过滤 (前端逻辑)
                if ("AM".equalsIgnoreCase(timeFilter) || "PM".equalsIgnoreCase(timeFilter)) {
                    match = doc.getAvailableTimes().stream()
                            .anyMatch(slot -> isTimeInAmPm(slot, timeFilter));
                } 
                // 情况2：如果是具体时间段过滤 (CURL逻辑，例如 "09:00-10:00")
                else {
                    match = doc.getAvailableTimes().contains(timeFilter);
                }

                if (match) {
                    filteredDoctors.add(doc);
                }
            }
        }
        return filteredDoctors;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> filterDoctorsByNameSpecilityandTime(String name, String specialty, String time) {
        List<Doctor> doctors = doctorRepository.findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(name, specialty);
        List<Doctor> filtered = filterDoctorByTimeHelper(doctors, time);
        Map<String, Object> response = new HashMap<>();
        response.put("doctors", filtered);
        return response;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> filterDoctorByNameAndTime(String name, String time) {
        List<Doctor> doctors = doctorRepository.findByNameLike(name);
        List<Doctor> filtered = filterDoctorByTimeHelper(doctors, time);
        Map<String, Object> response = new HashMap<>();
        response.put("doctors", filtered);
        return response;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> filterDoctorByNameAndSpecility(String name, String specialty) {
        List<Doctor> doctors = doctorRepository.findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(name, specialty);
        Map<String, Object> response = new HashMap<>();
        response.put("doctors", doctors);
        return response;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> filterDoctorByTimeAndSpecility(String specialty, String time) {
        List<Doctor> doctors = doctorRepository.findBySpecialtyIgnoreCase(specialty);
        List<Doctor> filtered = filterDoctorByTimeHelper(doctors, time);
        Map<String, Object> response = new HashMap<>();
        response.put("doctors", filtered);
        return response;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> filterDoctorBySpecility(String specialty) {
        List<Doctor> doctors = doctorRepository.findBySpecialtyIgnoreCase(specialty);
        Map<String, Object> response = new HashMap<>();
        response.put("doctors", doctors);
        return response;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> filterDoctorsByTime(String time) {
        List<Doctor> doctors = doctorRepository.findAll();
        List<Doctor> filtered = filterDoctorByTimeHelper(doctors, time);
        Map<String, Object> response = new HashMap<>();
        response.put("doctors", filtered);
        return response;
    }
}