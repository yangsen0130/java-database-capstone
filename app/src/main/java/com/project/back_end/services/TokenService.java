package com.project.back_end.services;

import com.project.back_end.repo.AdminRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class TokenService {

    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    // In a real application, inject this from application.properties
    // Example: @Value("${jwt.secret}")
    // For this lab, we provide a default strong key string.
    @Value("${jwt.secret:defaultSecretKeyForTestingPurposesOnlyToMakeItLongEnough1234567890}")
    private String jwtSecret;

    public TokenService(AdminRepository adminRepository, DoctorRepository doctorRepository, PatientRepository patientRepository) {
        this.adminRepository = adminRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String identifier) {
        return Jwts.builder()
                .setSubject(identifier)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7)) // 7 days
                .signWith(getSigningKey())
                .compact();
    }

    public String extractIdentifier(String token) {
    try {
        return Jwts.parser() // 1. 改用 parser()
                .verifyWith(getSigningKey()) // 2. 改用 verifyWith 替代 setSigningKey
                .build()
                .parseSignedClaims(token) // 3. 改用 parseSignedClaims 替代 parseClaimsJws
                .getPayload() // 4. 改用 getPayload 替代 getBody
                .getSubject();
    } catch (Exception e) {
        return null;
    }
}

    public boolean validateToken(String token, String userType) {
        String identifier = extractIdentifier(token);
        if (identifier == null) return false;

        switch (userType.toLowerCase()) {
            case "admin":
                return adminRepository.findByUsername(identifier) != null;
            case "doctor":
                return doctorRepository.findByEmail(identifier) != null;
            case "patient":
                return patientRepository.findByEmail(identifier) != null;
            default:
                return false;
        }
    }
}