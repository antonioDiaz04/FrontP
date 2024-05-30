export interface Ruta {
    _id: string; // Identificador único de la ruta
    repartidorId: string; // Identificador del repartidor asociado a la ruta
    vehiculoId:string; // Array de vehículos asociados a la ruta
    clienteIds: string[]; // Identificadores de los clientes asociados a la ruta
    fechaInicio: Date; // Fecha de inicio de la ruta
    fechaFin?: Date; // Fecha de finalización de la ruta (opcional si la ruta aún está en curso)
    estado: 'pendiente' | 'en_curso' | 'finalizada'; // Estado actual de la ruta
    // Otros datos relevantes para el modelo de ruta
    descripcion: string; // Descripción de la ruta
    comentarios: string[]; // Array de comentarios o notas sobre la ruta
    puntosDeEntrega: {
        direccion: string; // Dirección de entrega
        clienteId: string; // Identificador del cliente asociado a la dirección de entrega
    }[];
}
