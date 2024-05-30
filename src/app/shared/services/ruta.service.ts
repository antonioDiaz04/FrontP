import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RutaService {

  constructor(private http: HttpClient) { }
  
  getRepartidores(): Observable<any> {
    return this.http.get(`${environment.api}/purificadoraRepartidores/obtenerRepartidores`);
  }

  detalleUsuarioById(id: string): Observable<any> {
    const url = `${environment.api}/purificadoraRepartidores/getDetalles/` + id
    return this.http.get(url)
  }
  updateRepartidora(id: string, cliente: any): Observable<any> {
    const url = `${environment.api}/purificadoraRepartidores/actualiza/` + id
    return this.http.put(url, cliente)
  }

  eliminarRepartidores(id: string): Observable<any> {
    const url = `${environment.api}/purificadoraRepartidores/deleteRepartidor/` + id
    return this.http.delete(url)
  }



  signUp(data: any): Observable<any> {
    const url = `${environment.api}/purificadoraRepartidores/crearRepartidores/`
    return this.http.post(url, data)
  }


}
