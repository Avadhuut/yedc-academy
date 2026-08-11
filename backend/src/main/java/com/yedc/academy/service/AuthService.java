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
    public AuthResponse register(RegisterRequest registerRequest) {
        String normalizedEmail = registerRequest.getEmail() != null 
                ? registerRequest.getEmail().trim().toLowerCase() 
                : "";

        if (accountRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new BadRequestException("Email address already in use.");
        }

        Role studentRole = roleRepository.findByName(RoleName.STUDENT)
                .orElseThrow(() -> new BadRequestException("Default STUDENT role not set."));

        Account account = Account.builder()
                .fullName(registerRequest.getFullName() != null ? registerRequest.getFullName().trim() : "")
                .email(normalizedEmail)
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .phone(registerRequest.getPhone())
                .role(studentRole)
                .status("ACTIVE")
                .build();

        Account savedAccount = accountRepository.save(account);

        UserPrincipal userPrincipal = UserPrincipal.create(savedAccount);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userPrincipal, null, userPrincipal.getAuthorities()
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .accessToken(jwt)
                .user(mapToProfileResponse(savedAccount))
                .build();
    }

    public AuthResponse login(LoginRequest loginRequest) {
        String normalizedEmail = loginRequest.getEmail() != null 
                ? loginRequest.getEmail().trim().toLowerCase() 
                : "";

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        normalizedEmail,
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        ProfileResponse userProfile = ProfileResponse.builder()
                .id(userPrincipal.getId())
                .fullName(userPrincipal.getFullName())
                .email(userPrincipal.getEmail())
                .phone(userPrincipal.getPhone())
                .profileImage(userPrincipal.getProfileImage())
                .role(userPrincipal.getAuthorities().stream()
                        .findFirst()
                        .map(a -> a.getAuthority().replace("ROLE_", ""))
                        .orElse("STUDENT"))
                .status(userPrincipal.isEnabled() ? "ACTIVE" : "INACTIVE")
                .build();

        return AuthResponse.builder()
                .accessToken(jwt)
                .user(userProfile)
                .build();
    }

    public void forgotPassword(String email) {
        String normalizedEmail = email != null ? email.trim().toLowerCase() : "";
        if (!accountRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new BadRequestException("User not found with email: " + email);
        }
        String mockResetCode = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        log.info("MOCK MAIL SYSTEM: Sending reset code {} to email {}", mockResetCode, normalizedEmail);
    }

    @Transactional
    public void resetPassword(String email, String resetCode, String newPassword) {
        String normalizedEmail = email != null ? email.trim().toLowerCase() : "";
        log.info("MOCK MAIL SYSTEM: Verification of code {} for email {}", resetCode, normalizedEmail);
        Account account = accountRepository.findByEmailIgnoreCase(normalizedEmail)
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
