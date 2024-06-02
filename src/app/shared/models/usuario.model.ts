export class Usuario {
  _id?: number;
  nombre: string;
  email: string;
  longitud: string;
  latitud: string;
  telefono: string;
  numCasa: string;
  municipio: string;
  colonia:string
  constructor(nombre: string, telefono: string, longitud: string, email: string, latitud: string, numCasa: string, colonia: string,municipio:string) {
    this.nombre = nombre;
    this.telefono = telefono;
    this.email = email;
    this.longitud = longitud;
    this.latitud = latitud;
    this.numCasa = numCasa;
    this.municipio = municipio;
    this.colonia = colonia;
  }
}
