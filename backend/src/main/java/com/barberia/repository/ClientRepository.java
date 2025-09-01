package com.barberia.repository;

import com.barberia.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    
    Optional<Client> findByEmailAndIsActiveTrue(String email);
    
    Optional<Client> findByPhoneAndIsActiveTrue(String phone);
    
    List<Client> findByIsActiveTrue();
    
    @Query("SELECT c FROM Client c WHERE c.isActive = true ORDER BY c.lastName, c.firstName")
    List<Client> findAllActiveClientsOrdered();
    
    boolean existsByEmailAndIsActiveTrue(String email);
    
    boolean existsByPhoneAndIsActiveTrue(String phone);
}
