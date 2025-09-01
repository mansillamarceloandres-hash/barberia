package com.barberia.service;

import com.barberia.model.Appointment;
import com.barberia.model.AppointmentStatus;
import com.barberia.model.Client;
import com.barberia.model.Service;
import com.barberia.repository.AppointmentRepository;
import com.barberia.repository.ClientRepository;
import com.barberia.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    /**
     * Crea una nueva reserva validando que no haya conflictos de horario
     */
    public Appointment createAppointment(Long clientId, List<Long> serviceIds, 
                                       LocalDate date, LocalTime time, String notes) {
        
        // Validar que el cliente existe
        Client client = clientRepository.findById(clientId)
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        
        // Validar que los servicios existen
        List<Service> services = serviceRepository.findAllById(serviceIds);
        if (services.size() != serviceIds.size()) {
            throw new RuntimeException("Algunos servicios no fueron encontrados");
        }
        
        // Validar que no haya reserva previa para el mismo cliente en la misma fecha
        if (appointmentRepository.existsByClientAndDate(clientId, date)) {
            throw new RuntimeException("El cliente ya tiene una reserva para esta fecha");
        }
        
        // Calcular precio total y duración
        BigDecimal totalPrice = services.stream()
            .map(Service::getPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Integer totalDuration = services.stream()
            .mapToInt(Service::getDurationMinutes)
            .sum();
        
        // Validar disponibilidad del horario
        if (!isTimeSlotAvailable(date, time, totalDuration)) {
            throw new RuntimeException("El horario seleccionado no está disponible");
        }
        
        // Crear la reserva
        Appointment appointment = new Appointment(client, services, date, time, totalPrice, totalDuration);
        appointment.setNotes(notes);
        
        return appointmentRepository.save(appointment);
    }

    /**
     * Verifica si un horario está disponible para una duración específica
     */
    public boolean isTimeSlotAvailable(LocalDate date, LocalTime time, Integer durationMinutes) {
        LocalTime endTime = time.plusMinutes(durationMinutes);
        
        // Verificar que no haya reservas que se superpongan
        List<Appointment> conflictingAppointments = appointmentRepository
            .findConflictingAppointments(date, time, endTime, AppointmentStatus.CONFIRMED);
        
        return conflictingAppointments.isEmpty();
    }

    /**
     * Obtiene todas las reservas confirmadas para una fecha específica
     */
    public List<Appointment> getAppointmentsByDate(LocalDate date) {
        return appointmentRepository.findByAppointmentDateAndStatus(date, AppointmentStatus.CONFIRMED);
    }

    /**
     * Obtiene todas las reservas de un cliente
     */
    public List<Appointment> getAppointmentsByClient(Long clientId) {
        return appointmentRepository.findByClientIdAndStatus(clientId, AppointmentStatus.CONFIRMED);
    }

    /**
     * Cancela una reserva
     */
    public Appointment cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        
        appointment.setStatus(AppointmentStatus.CANCELLED);
        return appointmentRepository.save(appointment);
    }

    /**
     * Marca una reserva como completada
     */
    public Appointment completeAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        
        appointment.setStatus(AppointmentStatus.COMPLETED);
        return appointmentRepository.save(appointment);
    }

    /**
     * Obtiene todas las reservas activas
     */
    public List<Appointment> getAllActiveAppointments() {
        return appointmentRepository.findByStatusOrderByAppointmentDateAscAppointmentTimeAsc(AppointmentStatus.CONFIRMED);
    }

    /**
     * Obtiene las reservas en un rango de fechas
     */
    public List<Appointment> getAppointmentsInDateRange(LocalDate startDate, LocalDate endDate) {
        return appointmentRepository.findAppointmentsInDateRange(startDate, endDate, AppointmentStatus.CONFIRMED);
    }
}
