import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RutaService {

  constructor(private http: HttpClient) { }
  
  getRutas(): Observable<any> {
    return this.http.get(`${environment.api}/purificadoraAdmin/getRutas`);
  }

  detalleRutaById(id: string): Observable<any> {
    const url = `${environment.api}/purificadoraAdmin/getDetallesRutaById/` + id
    return this.http.get(url)
  }
  
  updateRepartidora(id: string, cliente: any): Observable<any> {
    const url = `${environment.api}/purificadoraRepartidores/actualiza/` + id
    return this.http.put(url, cliente)
  }

  eliminarRuta(id: string): Observable<any> {
    const url = `${environment.api}/purificadoraAdmin/deleteRuta/` + id
    return this.http.delete(url)
  }

  eliminarPuntoEntrega(id: string): Observable<any> {
    const url = `${environment.api}/purificadoraAdmin/deletePuntoEntrega/` + id
    return this.http.delete(url)
  }



  addRuta(data: any): Observable<any> {
    const url = `${environment.api}/purificadoraAdmin/crearRuta/`
    return this.http.post(url, data)
  }
  addPuntoEntregaRutaById(id:string,data: any): Observable<any> {
    const url = `${environment.api}/purificadoraAdmin/crearPuntoCliente/` + id
    return this.http.post(url, data)
  }


}
