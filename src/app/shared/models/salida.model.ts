import { Cliente } from "../interfaces/client.interface";
export interface PuntoDeEntrega {
    clienteId?: Cliente;
    _id: string;
}

export class Salida {
    _id?: string; // Identificador único de la ruta
    nombreRuta!: string;
    repartidorId!: string; // Identificador del repartidor asociado a la ruta
    vehiculoId!: string; // Identificador del vehículo asociado a la ruta
    // fechaInicio?: Date; // Fecha de inicio de la ruta
    // fechaFin?: Date; // Fecha de finalización de la ruta (opcional si la ruta aún está en curso)
    estado?: 'enviado'|'recivido'| 'pendiente' | 'en_curso' | 'finalizada'; // Estado actual de la ruta
    puntosDeEntrega: PuntoDeEntrega | any;
    // diasAsignados!: string[];
    cantidadBotellas?: Number;
    esSalida?:boolean;

}

