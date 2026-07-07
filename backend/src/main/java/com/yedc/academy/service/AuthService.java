package com.yedc.academy.service;

import com.yedc.academy.dto.AuthResponse;
import com.yedc.academy.dto.LoginRequest;
import com.yedc.academy.dto.ProfileResponse;
import com.yedc.academy.dto.RegisterRequest;
import com.yedc.academy.exception.BadRequestException;
import com.yedc.academy.model.Account;
import com.yedc.academy.model.Role;
import com.yedc.academy.model.RoleName;
import com.yedc.academy.repository.AccountRepository;
import com.yedc.academy.repository.RoleRepository;
import com.yedc.academy.security.JwtTokenProvider;
import com.yedc.academy.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public ProfileResponse register(RegisterRequest registerRequest) {
        if (accountRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email address already in use.");
        }

        Role studentRole = roleRepository.findByName(RoleName.STUDENT)
                .orElseThrow(() -> new BadRequestException("Default STUDENT role not set."));

        Account account = Account.builder()
                .fullName(registerRequest.getFullName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .phone(registerRequest.getPhone())
                .role(studentRole)
                .status("ACTIVE")
                .build();

        Account savedAccount = accountRepository.save(account);
        return mapToProfileResponse(savedAccount);
    }

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Account account = accountRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new BadRequestException("Authenticated user account not found."));

        return AuthResponse.builder()
                .accessToken(jwt)
                .user(mapToProfileResponse(account))
                .build();
    }

    public void forgotPassword(String email) {
        // Stub/Mock forgot password flow for MVP
        if (!accountRepository.existsByEmail(email)) {
            throw new BadRequestException("User not found with email: " + email);
        }
        String mockResetCode = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        log.info("MOCK MAIL SYSTEM: Sending reset code {} to email {}", mockResetCode, email);
    }

    @Transactional
    public void resetPassword(String email, String resetCode, String newPassword) {
        // Stub/Mock reset password verification
        log.info("MOCK MAIL SYSTEM: Verification of code {} for email {}", resetCode, email);
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found with email: " + email));
        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);
    }

    public ProfileResponse mapToProfileResponse(Account account) {
        return ProfileResponse.builder()
                .id(account.getId())
                .fullName(account.getFullName())
                .email(account.getEmail())
                .phone(account.getPhone())
                .profileImage(account.getProfileImage())
                .role(account.getRole().getName().name())
                .status(account.getStatus())
                .build();
    }
}
