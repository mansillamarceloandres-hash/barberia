package com.barberia.repository;

import com.barberia.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    
    List<Service> findByIsActiveTrue();
    
    Optional<Service> findByNameAndIsActiveTrue(String name);
    
    @Query("SELECT s FROM Service s WHERE s.isActive = true ORDER BY s.name")
    List<Service> findAllActiveServicesOrdered();
    
    boolean existsByNameAndIsActiveTrue(String name);
}
