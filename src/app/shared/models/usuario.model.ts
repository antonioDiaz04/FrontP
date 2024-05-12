export class Usuario {
  _id?: number;
  nombre: string;
  email: string;
  password1: string;
  passwordConfirmar: string;
  longitud: string;
  latitud: string;
  telefono: string;
  numCasa: string;
  constructor(nombre: string, telefono: string, longitud: string, email: string, passwordConfirmar: string, password1: string, latitud: string, numCasa: string) {
    this.nombre = nombre;
    this.telefono = telefono;
    this.email = email;
    this.longitud = longitud;
    this.password1 = password1;
    this.passwordConfirmar = passwordConfirmar;
    this.latitud = latitud;
    this.numCasa = numCasa;
  }
}
