# Pseudocódigo Ejercicio 2 - Sistema de Reservas

## Descripción

Este ejercicio indicaba que había que diseñar el endpoint y describir la funcionalidad en psudocódigo, pero he creado una aplicación funcional en Nextjs. Este documento describe la estructura de la base de datos, el flujo del endpoint de reserva de citas y estrategias de escalabilidad para un sistema de reservas de servicios. Además de las tareas definidas para el ejercicio, he desarrollado un frontend que permite la creación de reservas mediante un formulario e incluye un área de visualización de reservas que se actualiza en tiempo real.

## Base de Datos

### Modelo `User`

```prisma
model User {
  id String @id @default(uuid())
  name String
  email String @unique
  reservations Reservation[]
}
```

### Modelo `Service`

```prisma
model Service {
  id String @id @default(uuid())
  name String
  duration Int
  reservations Reservation[]
}
```

### Modelo `Reservation`

```prisma
model Reservation {
  id String @id @default(uuid())
  userId String
  serviceId String
  startTime DateTime
  endTime DateTime

  name String
  email String

  user User @relation(fields: [userId], references:[id], onDelete: Cascade)
  service Service @relation(fields: [serviceId], references:[id], onDelete: Cascade)

  @@unique([serviceId, startTime])
  @@index([startTime, endTime])
}
```

---

## Endpoint: `reservarCita(serviceId, name, email, startTime)`

### Flujo de Ejecución

1. **Validar** que `serviceId`, `name`, `email` y `startTime` no sean vacíos.

   - Si algún dato es inválido, retornar: `"Error: Datos inválidos"`.

2. **Verificar** si el usuario ya existe en la base de datos.

   - Si no existe, **crear un nuevo usuario** con `name` y `email`.

3. **Obtener** la duración del servicio usando `serviceId`.

   - Si el servicio no existe, retornar: `"Error: Servicio no encontrado"`.

4. **Calcular** `endTime = startTime + duración del servicio`.

5. **Verificar** si el usuario ya tiene una reserva en ese horario.

   - Si existe solapamiento, retornar: `"Error: Ya tienes una reserva en este horario"`.

6. **Verificar** si el servicio ya está reservado en ese horario.

   - Si existe solapamiento, retornar: `"Error: Este horario ya está ocupado"`.

7. **Crear** una nueva reserva con:

   - `UsuarioID = user.id`
   - `ServicioID = serviceId`
   - `InicioReserva = startTime`
   - `FinReserva = endTime`
   - `Nombre = name`
   - `Email = email`

8. **Retornar** `"Reserva creada con éxito"`.

---

## Server Actions

Se han desarrollado **Server Actions** para facilitar la obtención de datos en el frontend:

- **Obtener reservas:** Recupera la lista de reservas existentes.
- **Obtener servicios disponibles:** Devuelve los servicios que pueden ser reservados.

---

## Frontend

Se ha desarrollado un frontend que permite la gestión de reservas mediante un formulario. Este frontend incluye:

- Un formulario para crear nuevas reservas.
- Un área de visualización donde se muestran las reservas actuales.
- Actualización en tiempo real de las reservas cuando se crea una nueva.

---

## Servicios Iniciales

Dentro de la tabla de **Servicios**, se han predefinido algunos servicios para que estén disponibles desde el inicio del sistema.

---

## Estrategias de Escalabilidad

### 1. Optimizar la Base de Datos para Consultas Rápidas

- Uso de **índices** para acelerar las búsquedas.

### 2. Uso de Caché (Redis)

- Almacenar reservas recientes en **Redis** para reducir la carga en la base de datos.

### 3. Escalabilidad de la Base de Datos

- **Particionamiento**: Dividir datos en diferentes tablas (por fecha, ubicación, etc.).
- **Sharding**: Distribuir datos en varios servidores para mejorar el rendimiento.

### 4. Manejo de Concurrencia en Reservas

- Implementar una **cola de trabajo** para procesar reservas en orden y evitar solapamientos.

### 5. Arquitectura de Microservicios

- Separar el sistema en microservicios: `reservas`, `pagos`, `usuarios`, etc.
- Permite escalabilidad y actualizaciones independientes.

### 6. Monitoreo y Escalado Automático

- Usar herramientas de **monitoreo** para detectar carga elevada.
- Implementar **autoscaling** para agregar servidores cuando sea necesario.

---

## Configuración del Proyecto

### Variables de Entorno

Para utilizar este proyecto, es necesario crear un archivo `.env` y definir la URL de la base de datos PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:contraseña@host:puerto/nombre_base_datos"
```

Asegúrate de reemplazar `usuario`, `contraseña`, `host`, `puerto` y `nombre_base_datos` con los valores correctos de tu configuración.