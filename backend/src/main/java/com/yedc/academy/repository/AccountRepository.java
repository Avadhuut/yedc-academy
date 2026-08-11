package com.yedc.academy.repository;

import com.yedc.academy.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByEmail(String email);
    Optional<Account> findByEmailIgnoreCase(String email);
    Boolean existsByEmail(String email);
    Boolean existsByEmailIgnoreCase(String email);
}
