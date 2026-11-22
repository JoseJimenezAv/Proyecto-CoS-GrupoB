// Interfaz que representa una reserva tanto para formularios como para listados con JOIN
export interface Reservas {
    id_reserva: number;
    id_cliente: number;
    id_espacio: number;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    estado: EstadoReserva;

    // Datos complementarios obtenidos mediante INNER JOIN en el listado de reservas
    cliente_nombre: string;
    cliente_cedula: string;
    espacio_nombre: string;
    espacio_tipo: string;
    precio_hora: number;
}

// Define los estados válidos para una reserva en el sistema
export type EstadoReserva = 'Pendiente' | 'Confirmada' | 'Cancelada';
