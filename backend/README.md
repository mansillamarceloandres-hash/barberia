# Backend de Barbería - Spring Boot

Este es el backend para el sistema de reservas de barbería desarrollado en Java 17 con Spring Boot.

## Requisitos

- Java 17 o superior
- Gradle 8.5 o superior

## Características

- **Gestión de Servicios**: Corte, barba, servicios combinados
- **Gestión de Clientes**: Registro y gestión de clientes
- **Sistema de Reservas**: Con validación de conflictos de horario
- **Validación de Reglas de Negocio**: Solo un cliente por horario
- **API REST**: Endpoints para todas las operaciones
- **Base de Datos H2**: En memoria para desarrollo

## Estructura del Proyecto

```
src/main/java/com/barberia/
├── model/           # Entidades JPA
├── repository/      # Repositorios de datos
├── service/         # Lógica de negocio
├── controller/      # Controladores REST
└── dto/            # Objetos de transferencia de datos
```

## Configuración

El proyecto está configurado para usar:
- Puerto: 8080
- Context path: /api
- Base de datos H2 en memoria
- Console H2 disponible en: http://localhost:8080/api/h2-console

## Ejecución

### Con Gradle Wrapper (Recomendado)

```bash
# Ejecutar la aplicación
./gradlew bootRun

# Construir el proyecto
./gradlew build

# Ejecutar tests
./gradlew test
```

### Con Gradle instalado

```bash
# Ejecutar la aplicación
gradle bootRun

# Construir el proyecto
gradle build

# Ejecutar tests
gradle test
```

## Endpoints de la API

### Reservas (Appointments)

- `POST /api/appointments` - Crear nueva reserva
- `GET /api/appointments` - Obtener todas las reservas activas
- `GET /api/appointments/date/{date}` - Obtener reservas por fecha
- `GET /api/appointments/client/{clientId}` - Obtener reservas por cliente
- `GET /api/appointments/availability` - Verificar disponibilidad
- `PUT /api/appointments/{id}/cancel` - Cancelar reserva
- `PUT /api/appointments/{id}/complete` - Marcar como completada
- `GET /api/appointments/range` - Obtener reservas en rango de fechas

### Parámetros para crear reserva

```
POST /api/appointments
- clientId: ID del cliente
- serviceIds: Lista de IDs de servicios
- date: Fecha (YYYY-MM-DD)
- time: Hora (HH:mm)
- notes: Notas opcionales
```

## Reglas de Negocio

1. **Un cliente por horario**: No se pueden hacer múltiples reservas para el mismo cliente en la misma fecha
2. **Validación de conflictos**: El sistema verifica que no haya superposición de horarios
3. **Horarios de trabajo**: Lunes a Sábado de 9:00 a 19:00
4. **Duración de slots**: 30 minutos por defecto

## Base de Datos

La aplicación usa H2 en memoria con las siguientes tablas:
- `services` - Servicios disponibles
- `clients` - Clientes registrados
- `appointments` - Reservas/citas
- `appointment_services` - Relación muchos a muchos entre reservas y servicios

## Desarrollo

Para desarrollo local, la aplicación:
- Crea automáticamente las tablas al iniciar
- Incluye console H2 para inspeccionar la base de datos
- Muestra logs SQL para debugging
- Permite CORS desde cualquier origen

## Próximos Pasos

- [ ] Implementar autenticación JWT
- [ ] Agregar validaciones más robustas
- [ ] Implementar notificaciones por email
- [ ] Agregar reportes y estadísticas
- [ ] Implementar cache para mejorar performance
