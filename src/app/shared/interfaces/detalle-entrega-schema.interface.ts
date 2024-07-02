import { Repartidor } from "./repartidor.interface";
import { Ruta } from "./ruta.interface";
import { Cliente } from "./client.interface";
import { Vehiculo } from "./vehiculo.interface";

export interface PuntoDeEntrega {
    clienteId?: Cliente;
    _id: string;
}


export interface DetalleEntregaInterface {
    _id?: string;
    cantidadBotellas?: Number;

    nombreRuta?: string;
    repartidorId?: Repartidor;
    vehiculoId?: Vehiculo;
    fechaInicio?: Date;
    fechaFin?: Date;
    estado?: 'pendiente' | 'en_curso' | 'finalizada';
    puntosDeEntrega: PuntoDeEntrega | any;
    diasAsignados?: string[];
}



// export interface DetalleEntregaInterface {
//     _id?: string;
//     cantidadBotellas?: Number;
//     rutaId?: Ruta;
//     repartidorId?: Repartidor;
//     vehiculoId?: Vehiculo;
//     fechaInicio?: Date;
//     fechaFin?: Date;
//     estado?: 'ninguno'| 'pendiente' | 'en_curso' | 'finalizada' | 'parcialmente_entregado';
//     clienteId: string[] | any;
//     diasAsignados?: string[];
//     cantidadBotellasEntregados: Number;
//     cantidadBotellasPendientes: Number;
// }




// export interface DetalleEntregaSchemaInterface {

    
// }

