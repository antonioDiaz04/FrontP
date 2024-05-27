export class Repartidor {
    _id?: string;
    nombre: string;
    email: string;
    telefono: string;
    numCasa: string;
    password1: string;
    // fechaDeAgregacion: string;

    constructor(nombre: string, email: string, telefono: string, numCasa: string, password1:string) {
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.numCasa = numCasa;
        this.password1 = password1;
        // this.fechaDeAgregacion = fechaDeAgregacion;
    }
}
