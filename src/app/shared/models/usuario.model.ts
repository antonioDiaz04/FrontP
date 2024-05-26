export class Usuario {
  _id?: number;
  nombre: string;
  email: string;
  longitud: string;
  latitud: string;
  telefono: string;
  numCasa: string;
  constructor(nombre: string, telefono: string, longitud: string, email: string, latitud: string, numCasa: string) {
    this.nombre = nombre;
    this.telefono = telefono;
    this.email = email;
    this.longitud = longitud;
    this.latitud = latitud;
    this.numCasa = numCasa;
  }
}
