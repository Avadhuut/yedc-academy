package com.yedc.academy.service;

import com.yedc.academy.dto.ChangePasswordRequest;
import com.yedc.academy.dto.ProfileResponse;
import com.yedc.academy.dto.UpdateProfileRequest;
import com.yedc.academy.exception.BadRequestException;
import com.yedc.academy.exception.ResourceNotFoundException;
import com.yedc.academy.model.Account;
import com.yedc.academy.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
        return mapToProfileResponse(account);
    }

    @Transactional
    public ProfileResponse updateProfile(Long id, UpdateProfileRequest request) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        account.setFullName(request.getFullName());
        account.setPhone(request.getPhone());
        if (request.getProfileImage() != null) {
            account.setProfileImage(request.getProfileImage());
        }

        Account updated = accountRepository.save(account);
        return mapToProfileResponse(updated);
    }

    @Transactional
    public void changePassword(Long id, ChangePasswordRequest request) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        if (!passwordEncoder.matches(request.getOldPassword(), account.getPassword())) {
            throw new BadRequestException("Old password does not match.");
        }

        account.setPassword(passwordEncoder.encode(request.getNewPassword()));
        accountRepository.save(account);
    }

    private ProfileResponse mapToProfileResponse(Account account) {
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
