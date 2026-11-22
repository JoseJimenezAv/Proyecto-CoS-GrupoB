// Interfaz que representa un espacio registrado (cancha, salón, etc.)
export interface Espacios {
    id_espacio: number;
    nombre: string;
    tipo: string;
    capacidad: number;
    precio_hora: number;
    estado: EstadoUsuario;
}

// Define los estados operativos disponibles para un espacio en el sistema
export type EstadoUsuario = 'Disponible' | 'Mantenimiento';