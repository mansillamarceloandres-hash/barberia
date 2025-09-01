package com.barberia.repository;

import com.barberia.model.Appointment;
import com.barberia.model.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    List<Appointment> findByAppointmentDateAndStatus(LocalDate date, AppointmentStatus status);
    
    List<Appointment> findByClientIdAndStatus(Long clientId, AppointmentStatus status);
    
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate = :date " +
           "AND a.status = :status " +
           "AND ((a.appointmentTime >= :startTime AND a.appointmentTime < :endTime) " +
           "OR (a.appointmentTime + INTERVAL a.totalDurationMinutes MINUTE > :startTime " +
           "AND a.appointmentTime < :endTime))")
    List<Appointment> findConflictingAppointments(
        @Param("date") LocalDate date,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime,
        @Param("status") AppointmentStatus status
    );
    
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate >= :startDate " +
           "AND a.appointmentDate <= :endDate " +
           "AND a.status = :status " +
           "ORDER BY a.appointmentDate, a.appointmentTime")
    List<Appointment> findAppointmentsInDateRange(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        @Param("status") AppointmentStatus status
    );
    
    List<Appointment> findByStatusOrderByAppointmentDateAscAppointmentTimeAsc(AppointmentStatus status);
    
    @Query("SELECT COUNT(a) > 0 FROM Appointment a WHERE a.client.id = :clientId " +
           "AND a.appointmentDate = :date " +
           "AND a.status IN ('CONFIRMED', 'COMPLETED')")
    boolean existsByClientAndDate(@Param("clientId") Long clientId, @Param("date") LocalDate date);
}
