import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

  
export class RutaService {

  constructor(private http: HttpClient) { }
  
  getNombreRutas(): Observable<any> {
    return this.http.get(`${environment.api}/ruta/getNombreRutas`);
  }

  getDetallesEntregasRutas(): Observable<any> {
    return this.http.get(`${environment.api}/ruta/getDetallesEntregasRutas`);
  }

  detalleRutaById(id: string): Observable<any> {
    const url = `${environment.api}/ruta/getDetallesRutaById/` + id
    return this.http.get(url)
  }

  updateRepartidora(id: string, cliente: any): Observable<any> {
    const url = `${environment.api}/purificadoraRepartidores/actualiza/` + id
    return this.http.put(url, cliente)
  }
  updateRutaEntregaDetalle(id: string, cliente: any): Observable<any> {
    const url = `${environment.api}/ruta/updateRutaDetalle/` + id
    return this.http.put(url, cliente)
  }

  eliminarRuta(id: string): Observable<any> {
    const url = `${environment.api}/ruta/deleteRuta/` + id
    return this.http.delete(url)
  }

  eliminarPuntoEntrega(id: string): Observable<any> {
    const url = `${environment.api}/ruta/deletePuntoEntrega/` + id
    return this.http.delete(url)
  }

  addNombreRuta(data: any): Observable<any> {
    const url = `${environment.api}/ruta/crearNombreRuta/`
    return this.http.post(url, data)
  }
  addRuta(data: any): Observable<any> {
    const url = `${environment.api}/ruta/crearProgramadoEntregaRuta/`
    return this.http.post(url, data)
  }
  addPuntoEntregaRutaById(id:string,data: any): Observable<any> {
    const url = `${environment.api}/ruta/crearPuntoCliente/` + id
    return this.http.post(url, data)
  }


}
