import { Repartidor } from "./repartidor.interface";
import { Ruta } from "./ruta.interface";
import { Vehiculo } from "./vehiculo.interface";


export interface DetalleEntregaInterface {
    _id?: string;
    cantidadBotellas?: Number;
    rutaId?: Ruta;
    repartidorId?: Repartidor;
    vehiculoId?: Vehiculo;
    fechaInicio?: Date;
    fechaFin?: Date;
    estado?: 'pendiente' | 'en_curso' | 'finalizada' | 'parcialmente_entregado';
    clienteId: string[] | any;
    diasAsignados?: string[];
    cantidadBotellasEntregados: Number;
    cantidadBotellasPendientes: Number;
}




// export interface DetalleEntregaSchemaInterface {

    
// }

