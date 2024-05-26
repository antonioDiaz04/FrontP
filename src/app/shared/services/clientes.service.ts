import { HttpClient } from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cliente } from '../interfaces/client.interface';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient) { }


  // !mover a otro servicio
  obtenerPurificadoras(): Observable<any> {
    const url = `${environment.api}/purificadoraAdmin/getPuricadoras`;
    return this.http.get(url);
  }

  // http://localhost:4000/usuarios/getUsuarios
  obtenerCLientes(): Observable<any> {
    const url = `${environment.api}/usuarios/getUsuarios`
    return this.http.get(url)

  }
  detalleProductoById(id:string): Observable<any> {
    const url = `${environment.api}/usuarios/getDetalles/` + id
    return this.http.get(url)

  }
  
  updateUsuario(id: string, cliente: any): Observable<any> {
    const url = `${environment.api}/usuarios/actualiza/` + id
    return this.http.put(url, cliente)
  }





  eliminarPurificadora(id: string): Observable<any> {
    const url = `${environment.api}/purificadoraAdmin/deletePurificadora/` + id
    return this.http.delete(url)
  }
  eliminarCliente(id: string): Observable<any> {
    const url = `${environment.api}/usuarios/deleteCliente/` + id
    return this.http.delete(url)
  }
}
