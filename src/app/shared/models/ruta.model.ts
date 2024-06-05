export class Ruta {
    _id?: string; // Identificador único de la ruta
    nombreRuta!: string;
    repartidorId!: string; // Identificador del repartidor asociado a la ruta
    vehiculoId!: string; // Identificador del vehículo asociado a la ruta
    fechaInicio?: Date; // Fecha de inicio de la ruta
    fechaFin?: Date; // Fecha de finalización de la ruta (opcional si la ruta aún está en curso)
    estado!: 'pendiente' | 'en_curso' | 'finalizada'; // Estado actual de la ruta
    puntosDeEntrega!: {
        municipio: string[];
        colonia: string[];
        clienteId: string[]
    }[]; 
    diasAsignados!: string[];

}
