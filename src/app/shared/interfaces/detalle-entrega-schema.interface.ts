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
    estado?: 'pendiente' | 'en_curso' | 'finalizada';
    clienteId: string[] | any;
    diasAsignados?: string[];
}




// export interface DetalleEntregaSchemaInterface {

    
// }

