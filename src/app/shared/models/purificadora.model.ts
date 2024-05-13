export class Purificadora {
    _id?: number;
    nombre: string;
    email: string;
    purificadora: string;
    calle: string;
    numero: string;
    estado: string;
    codigoPostal: string;
    longitud: string;
    latitud: string;
    telefono: string;
    constructor(nombre: string, telefono: string, longitud: string, email: string, calle: string, purificadora: string, latitud: string, numero: string, estado:string,codigoPostal:string) {
        this.nombre = nombre;
        this.telefono = telefono;
        this.email = email;
        this.longitud = longitud;
        this.purificadora = purificadora;
        this.calle = calle;
        this.latitud = latitud;
        this.codigoPostal = codigoPostal;
        this.estado = estado;
        this.numero = numero;
    }
}
