export class Vehiculo {
    _id?: string;
    marca: string;
    modelo: string;
    anio: number;
    placas: string;
    color?: string;
    kilometraje?: number;
    propietario?: string;

    constructor(marca: string, modelo: string, anio: number, placas: string, color?: string, kilometraje?: number, propietario?: string) {
        this.marca = marca;
        this.modelo = modelo;
        this.anio = anio;
        this.placas = placas;
        this.color = color;
        this.kilometraje = kilometraje;
        this.propietario = propietario;
    }
}
