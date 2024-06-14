import { Repartidor } from "./repartidor.interface";
import { Ruta } from "./ruta.interface";
import { Vehiculo } from "./vehiculo.interface";

export interface PuntoDeEntrega {
    municipio: string;
    colonia: string;
    clienteId: string;
    _id: string;
}


export interface DetalleEntregaInterface {
    _id?: string;
    rutaId?: Ruta;
    repartidorId?: Repartidor;
    vehiculoId?: Vehiculo;
    fechaInicio?: Date;
    fechaFin?: Date;
    estado?: 'pendiente' | 'en_curso' | 'finalizada';
    clientesIdsDeEntregas: PuntoDeEntrega | any;
    diasAsignados?: string[];
}




// export interface DetalleEntregaSchemaInterface {

    
// }

