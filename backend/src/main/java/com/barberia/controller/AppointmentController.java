package com.barberia.controller;

import com.barberia.model.Appointment;
import com.barberia.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    /**
     * Crear una nueva reserva
     */
    @PostMapping
    public ResponseEntity<Appointment> createAppointment(
            @RequestParam Long clientId,
            @RequestParam List<Long> serviceIds,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime time,
            @RequestParam(required = false) String notes) {
        
        try {
            Appointment appointment = appointmentService.createAppointment(clientId, serviceIds, date, time, notes);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtener todas las reservas activas
     */
    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = appointmentService.getAllActiveAppointments();
        return ResponseEntity.ok(appointments);
    }

    /**
     * Obtener reservas por fecha
     */
    @GetMapping("/date/{date}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Appointment> appointments = appointmentService.getAppointmentsByDate(date);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Obtener reservas por cliente
     */
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Appointments>> getAppointmentsByClient(@PathVariable Long clientId) {
        List<Appointments> appointments = appointmentService.getAppointmentsByClient(clientId);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Verificar disponibilidad de un horario
     */
    @GetMapping("/availability")
    public ResponseEntity<Boolean> checkAvailability(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime time,
            @RequestParam Integer durationMinutes) {
        
        boolean isAvailable = appointmentService.isTimeSlotAvailable(date, time, durationMinutes);
        return ResponseEntity.ok(isAvailable);
    }

    /**
     * Cancelar una reserva
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable Long id) {
        try {
            Appointment appointment = appointmentService.cancelAppointment(id);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Marcar una reserva como completada
     */
    @PutMapping("/{id}/complete")
    public ResponseEntity<Appointment> completeAppointment(@PathVariable Long id) {
        try {
            Appointment appointment = appointmentService.completeAppointment(id);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Obtener reservas en un rango de fechas
     */
    @GetMapping("/range")
    public ResponseEntity<List<Appointment>> getAppointmentsInRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<Appointment> appointments = appointmentService.getAppointmentsInDateRange(startDate, endDate);
        return ResponseEntity.ok(appointments);
    }
}
